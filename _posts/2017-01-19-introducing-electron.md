---
layout: post
title: "Electron, 웹기술로 크로스플랫폼 데스크톱 앱 만들기"
description: "Electron 은 깃헙(Github)에서 Atom 에디터를 만들기 위해 만든 것이다. Atom 은 HTML5, CSS, Javascript 등 순수하게 웹기술로 구현되었는데, 프레임워크를 따로 분리해서  Atom-shell 이라는 이름으로 공개했다. 후에 Electron 이라는 명칭으로 변경했다."
date: 2017-01-19 20:20:00
tags: [Javascript, Electron, Node.js, "삽질"]
image: "https://camo.githubusercontent.com/5dd01312b30468423cb45b582b83773f5a9019bb/687474703a2f2f656c656374726f6e2e61746f6d2e696f2f696d616765732f656c656374726f6e2d6c6f676f2e737667"
---

IT 분야 중 웹(Web)은 가장 역동적으로 발전하고 있는 분야 중 하나다. 그 중에서도 최근 가장 HOT한 언어를 꼽으라면 가장 먼저 생각나는 것이 **Javascript** 다! HTML5 등장 이후로 웹 개발에서 프론트엔드의 비중이 높아졌고, Javascript 의 생태계는 비약적으로 발전했다. 

나는 거의 매일 Javascript 코드를 작성하지만, 그동안 해왔던 작업을 반복했을 뿐 제대로 공부해본 적이 없다. Node.js 가 등장하고 Javascript 로 백엔드 작업이 가능해져도 Java, PHP, Python, Ruby 등으로도 충분히 가능한 데 구지 배울 필요가 있을까하는 마음에(*사실 새로 배우기 귀찮아서*) 지나쳤다. Angular.js, React.js, Vue.js 등의 UI 프레임워크들이 나오고 트렌드를 주도했지만 그냥 하던 방식대로 편하게(*jQuery 로도 잘 되는데 뭘..*) 작업했다.

## Javascript 어디까지 해봤니?

Javascript 에 관심이 전혀 없던 나의 생각을 고쳐준 것은 협업툴 **Slack** 과 **Atom** 에디터였다. 둘 다 굉장히 예쁜 UI를 가진 데스크톱 앱(*Java 의  Swing 으로 만든 UI는 정말 안예쁘다*)이었는데, 이게 웹기술로 만들었다는 충격적인 사실을 알게되었다. 웹기술이라니.. 내가 항상 쓰던 HTML5, CSS, Javascript 로도 데스크톱 앱을 만들 수 있다니! Javascript 로 브라우저를 벗어나 서버를 만들더니 이젠 데스크톱 앱까지 만들 수 있다. 한계가 어디까지인지 모를 일이다.

## Electron 소개

![][electron]

Electron 은 깃헙(Github)에서 Atom 에디터를 만들기 위해 만든 것이다. Atom 은 HTML5, CSS, Javascript 등 순수하게 웹기술로 구현되었는데, 프레임워크를 따로 분리해서  Atom-shell 이라는 이름으로 공개했다. 후에 Electron 이라는 명칭으로 변경했다. 내부적으로 ***Main Process 는 Node.js 로, Renderer Process 는 구글의 오픈소스 브라우져인 크로미움을 기반으로 되어있다.*** 모두 웹기술이며, 크로스 플랫폼이 가능한 스택이다. 멋지지 않은가?

Electron 개발 경험은 아직 걸음마 단계여서 깊이 있는 내용을 제시하지는 못하지만 겉으로 보이는 측면들을 살펴보면 다음과 같다.

### 장점
1. 순수 웹기술로 데스크톱 앱 제작
2. Mac, Windows, Linux 를 아우르는 크로스플랫폼 앱을 손쉽게 제작

### 단점
1. 문서화 부족. Github 에 한글화까지 되어있지만 다소(많이) 불친절
2. Reference 부족. 내가 올바른 방향으로 개발하고 있는 지 판단하기 어렵다.
3. 한국 커뮤니티의 부재. 참고자료 찾기 힘듦

### 대표적인 앱

#### Atom
- 깃헙이 만든 오픈소스 텍스트 에디터
- [https://atom.io/](https://atom.io/)

![][atom]

#### Slack
- 웹훅과 봇 등 다양한 API 를 제공해서 업무 효율성을 높여주는 협업 메신저
- [https://slack.com/](https://slack.com/)

![][slack]

#### Visual Studio Code
- 마이크로소프트가 내어놓은 가장 IDE에 근접한 텍스트 에디터
- [https://code.visualstudio.com/](https://code.visualstudio.com/)

![][vs-code]


## 개발 ~~삽질~~ 및 포스팅 계획

아래 스크린샷에 보이는 앱을 만드는 것이 1차 스터디 목표이다. 개인적으로 사용할 간단한 Todo List 앱인데, 보는 것처럼 UI 는 대강 나왔는데 Node.js 를 몰라 배우면서 진행해야겠다. 일단 최소한의 요구사항으로 개발해서 이것 저것 재미난 기능들을 붙여볼 생각이다. 찾아봤자 한국어 자료는 거의 없으니, 해외 자료 뒤져보면서 오픈소스 열어보면서 그 과정을 정리하면 유의미한 작업이 될 것 같다. 

그럼 커밍순~

![][todo-list]


---

*덧. 첫번째 작업은 유구한 전통에 따라 Hello World 를 찍어보겠다*


[electron]:	https://camo.githubusercontent.com/5dd01312b30468423cb45b582b83773f5a9019bb/687474703a2f2f656c656374726f6e2e61746f6d2e696f2f696d616765732f656c656374726f6e2d6c6f676f2e737667 "Electron"
[atom]: https://cdn-business.discourse.org/uploads/github_atom/487/cda7a1c2ac02fd3d.png "Atom"
[slack]: https://inteamwetrust.files.wordpress.com/2016/05/slack-logo.jpg "Slack"
[vs-code]: http://2434zd29misd3e4a4f1e73ki.wpengine.netdna-cdn.com/wp-content/uploads/2015/05/VS_rgb_Purple_D-800x227.png "Visual Studio Code"
[todo-list]: /public/images/posts/2017-01-19-introducing-electron/todo-list.png "TODO LIST UI"