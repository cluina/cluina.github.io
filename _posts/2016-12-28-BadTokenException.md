---
layout: post
title: "안드로이드 BadTokenException 의 원인과 해결방법"
description: "안드로이드 앱을 테스트하다보면 UI를 핸들링할 때, 가끔 BadTokenException이 발생하는 것을 볼 수가 있다. 보통 빌드 시에는 알 수 없고, 런타임 시점에서 발생하는 점에서 약간 골치가 아프다."
date: 2016-12-28 14:50:00
category: "ANDROID"
tags: [Android, Exception, BadTokenException]
image: "https://developer.android.com/static/images/home/jetpack-promo.svg?hl=ko"
---


안드로이드 앱을 테스트하다보면 UI를 핸들링할 때, 가끔 BadTokenException이 발생하는 것을 볼 수가 있다. 보통 빌드 시에는 알 수 없고, 런타임 시점에서 발생하는 점에서 약간 골치가 아프다. 특히 안드로이드의 초보인 나는 평소에는 잘 구동되던 다이얼로그 창에서 오류를 발생하는 것을 보고 적잖이 당황했다. 더구나 내가 구현하지도 않은 나쁜 토큰(Bad Token) 때문에 발생한 오류라니.. 좀 더 명확한 이유를 알고 싶었다. 내가 접한 예외 메시지는 다음과 같다.

> android.view.WindowManager$**BadTokenException**: Unable to add window -- token android.os.BinderProxy@40b47bd8 is not valid; is your activity running?

## 발생 원인

**BadTokenException이** 발생한 원인을 파악하기 위해 오류를 재현하던 중, 같은 코드라도 쓰레드 위치나 라이프 사이클 상의 시점에 따라 간헐적으로 발생하는 것을 발견했다. 쓰레드 위치는 Main Thread가 아닌 Background Thread에서, 주로 AsyncTask의 `onPostExecute()` 메소드에서 다이얼로그 창을 통해 사용자에게  무엇인가를 알려주려고 시도하는 경우 간헐적으로 발생한다. 발생하는 시점은 Background Thread의 작업이 모두 종료되기 전에 뒤로가기 버튼을 누르거나 명시적으로 `finish()`메소드를 호출할 때이다.
**BadTokenException의** 이유를 한문장으로 정리하면 , 예외 메시지에 *”is your activity running?”* 이라고 명시되어 있듯 종료된 Activity의 context를 인자로 다이얼로그 창을 표시하려고 할 때 발생한다. 다이얼로그 창을 표시할 Activity가 없기 때문에 안드로이드 런타임이 나쁜 토큰(Bad Token1))이라는 예외를 던진다.  

예를 들어보자면, 다음 코드와 같이 앱에 일정시간마다 사용자가 작업한 내용을 서버로 전송해서 자동 저장해주는 기능을 구현했다고 생각해보자. 서버 API는 수행결과를 JSON 형태의 메시지로 전송하고, 그 내용을 다이얼로그 창으로 사용자에게 전달하는 간단한 코드이다.  

  
```java
private class AutoSaveTask extends AsyncTask {

    @Override
    protected Boolean doInBackground (String... params) {
    
        // 데이터 저장 요청 코드...
    
    }
    
    @Override
    protected void onPostExecute (final Boolean success) {
    
        if (success) {
            try {
                JSONObject response = new JSONObject(responseString);
                String status = response.getString("status");
                String message = response.getString("msg");
            
                // 서버로 부터 받은 메시지를 다이얼로그 창으로 띄움.
                AlertDialog.Builder dialog = new AlertDialog.Builder(ThisActivity.this);
                dialog.setTitle(status);
                dialog.setMessage(message);
                ThisActivity.this.finish();
            
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
}
```


그런데 자동 저장 기능은 사용자가 자의든 타의든 뒤로가기 버튼이나 홈 버튼을 누를 때도 호출되면 아주 좋을 것 같다. 바로 `onPause()` 와 `onDestroy()` 메소드를 오버라이딩해서 자동저장 기능 호출하고 `finish()`로 Activity를 종료했다. 이제 사용자는 자신이 입력하던 데이터를 보호해주는 훌륭한 앱을 얻었다. 하지만 동시에 크래쉬가 발생해 앱이 종료되는 상황에 직면할 것이다.
안드로이드 라이프 사이클에 익숙한 개발자들에게는 간단한 문제일지 모르겠지만, 초보 개발자인 나에게는 어떨 때는 잘되고, 어떨 때는 크래쉬를 일으켜서 앱을 종료시켜버리는 상황이 난감했다. 어느 시점에 오류가 발생하는지 테스트해보니 백버튼을 눌렀을 때마다 크래쉬가 발생하는 것을 발견했다. 안드로이드 시스템에서 뒤로가기 버튼을 눌렀을 때는 `onDestroy()` 메소드가 호출된다.  



*Activity가 Destroy되는 시나리오들은:*

- 사용자가 뒤로가기 버튼을 눌렀을 때
- Activity 안에서 `finish()` 함수를 호출하여 명시적으로 종료할 때
- Stop된 상태에서 오랫동안 사용하지 않을 때
- Stop된 상태에서 전면에 있는 Activity에 더 많은 리소스를 필요할 때
- 사용자가 화면을 회전 시켰을 때
	  



상기 예제 코드같은 경우는 뒤로가기 버튼을 눌러서 `onDestroy()` 메소드가 호출하면 , 먼저 `AsyncTask`를 호출하고 바로 `super.onDestroy()`를 호출해서 Activity를 종료시킨다. 그렇게되면 Background Thread에서 AsyncTask가 실행되고 있는데 Main Thread가 종료되는 상황이다. 이렇게 되면, AsyncTask에서 다이얼로그 창을 열면서 인자로 넘겨주는 context는 이미 종료된 Activity의 것이 된다. 또한 가능성은 적지만, Background Thread(주로 AsyncTask)에서 UI를 핸들링하는 부분이 실행되기 전에 안드로이드 런타임에 의해 Activity가 정리될(위 시나리오 중 3, 4 번째에 해당) 경우에도 **BadTokenException**이 발생할 수 있다.




## 해결법

원인을 정확히 알았으니 해결법은 간단하다. 해당 UI들을 사용할 때, Activity가 종료되었는 지를 확인하면된다. 만약 종료되었다면 다이얼로그 창을 열지 않으면 그만이다. 다음과 같이 `isFinishing()` 메소드를 사용하면 Activity의 종료 여부를 확인할 수 있다.
  
```java
if (!ThisActivity.this.isFinishing()) {
    AlertDialog.builder dialog  = new AlertDialog.builder(ThisActivity.this);
    dialog.setTitle(status);
    dialog.setMessage(message);
    dialog.show();
}
```



---


1) Token : Window Token을 말한다. Window는 Activity가 자신의 레이아웃을 그리는 고유한 창이다. 윈도우 토큰은 안드로이드 시스템에서 윈도우 매니저가 윈도우를 식별하는 데 사용하는 유일무이한 토큰이다. 윈도우 토큰은 악성 어플리케이션이 다른 어플리케이션에 윈도우에 화면을 그릴 수 없게 보호하는 등 보안에 매우 중요한 역할을 한다. 만약 이 토큰이 일치하지 않는 경우 윈도우 매니저는 요청을 거부하고 BadTokenException을 던진다.
  
