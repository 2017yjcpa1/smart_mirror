# 3CP-A 캡스톤디자인 1조 프로젝트

3학년 1학기 CP-A반 캡스톤디자인 1조는 깃허브(Github)를 사용하여 프로젝트 협업 개발경험을 쌓기위해 개설되었습니다.

### 깃허브(Github) 란?
> Powerful collaboration, code review, and code management for open source and private projects. Public projects are always free. Work together across unlimited private repositories for $7 / month.
오픈 소스와 비공개 프로젝트를 위한 강력한 협업, 코드 미리보기, 그리고 코드 관리. 공개 프로젝트는 항상 무료입니다. 월 7$면 비공개 프로젝트를 제한 없이 생성할 수 있습니다.

저희 프로젝트는 2주 단위로 짧게 짧게 개발을 진행 해가는 [애자일 개발 방법론](https://ko.wikipedia.org/wiki/%EC%95%A0%EC%9E%90%EC%9D%BC_%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4_%EA%B0%9C%EB%B0%9C)을 채택 하였습니다.

애자일 방법론은 위키백과에서 다음과 같이 설명하고 있습니다.

> 애자일 개발 방법론은 계획을 통해서 주도해 나갔던 과거의 방법론과는 다르게 앞을 예측하며 개발을 하지 않고, 일정한 주기를 가지고 끊임없이 프로토 타입을 만들어내며 그때 그때 필요한 요구를 더하고 수정하여 하나의 커다란 소프트웨어를 개발해 나가는 adaptive style 이라고 할 수 있다.

즉, 아무런 계획없이 진행하지 않으며 그렇다고 지나친 계획으로 스트레스, 비용을 낭비하지 않는 중간의 타협점을 찾아 2주 단위로 그때 그때의 요구사항을 수립하여 프로젝트의 버전을 점점 발전해가며 커다란 소프트웨어로 완성시키는 것. 

## 팀원및 역할

### 총괄및 설계
- 차명도 (aw9223)

### A팀
- 김정현 (00125) : ???
- 김윤환 (hw00389) : ???

### B팀
- 이준호 (dkrdj8989) : ???
- 한지호 (jihohan1312) : ???

## 목표
본 저장소는 라즈베리파이(Raspberry Pi) 인터페이스를 이용하여 모션인식, 음성인식을 활용함으로써 사용자에게 각종 데이터혹은 피드백을 제공해주는 스마트거울 개발 목표를 두고있습니다.

## 개발환경
- 라즈베리파이
- 아두이노
- 안드로이드
- 노드 JS
- HTML, CSS, JS

## 설계도 (기획중)

![설계도](https://github.com/2017yjcpa1/smart_mirror/blob/master/20170307.png?raw=true)

### 아두이노
 - 라즈베리파이에서 외부의 물리적 데이터(온도,습도 등)가 필요한경우 센서역할을 담당합니다.
 - 일정시간 라즈베리파이가 잠자는경우(절전모드) 깨워주는 역할을 합니다.
 
### 라즈베리파이
 - 스마트미러의 핵심 인터페이스를 담당합니다.
 - 웹(HTML5)기반으로 개발합니다.
 - 뉴스, 일정, 시계, 날씨 기타 사용자에게 실생활에 필요한 데이터를 제공 해줍니다.
 
### 안드로이드
 - 사용자를 대신하여 스마트미러와 직접적인 통신을 가능하게 도와줍니다.
 - 스마트미러를 제어해주는 도구이며, 사용자맞춤 제공해주는 매개체입니다.
