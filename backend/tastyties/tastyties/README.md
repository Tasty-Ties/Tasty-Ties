# 백엔드 실행을 위한 절차

## 개요
여러분 백엔드 실행이 다들 쉽겠지만, 혹시라도 새로운 세팅이 추가되거나 하면 어려울 수도 있으니까!!

백엔드 실행을 위한 절차를 참고하여 실행해주세요.
## 기능
* **기능 1**: 사용자에게 백엔드 실행 방법 제공
* **기능 2**: 그냥 이종민에게 물어보세요

## 사용 방법
1. 프로젝트 설정:

+    `File` -> `Project Structure`에 _SDK_ 를 _JAVA17_ 로 설정하세요  


+    `Settings` -> `Build, Execution, Deplyoment` -> `Compiler` -> `Annotation Processor`에서 enable로 바꾸세요     


+    mysql db에 tastyties db가 없다면 
    ``` create database tastyties ``` 를 입력해주세요.

2. 메인 서버 환경 설정:

+ 먼저 `application.properties` 파일로 이동해주세요


+ `spring.datasource.username`, `spring.datasource.password`에 본인이 현재 로컬에 설치되어있는, db의 이름과 비밀번호를 기입합니다.


+ `jwt.secret` 에 충분히 긴 문자열을 넣어주세요 
+ `access key` 와 `secret key` 는 노션을 보고 키를 입력해주세요

3. 채팅 서버 환경 설정

+ resources 디렉토리가 안보인다면, java와 같은 level에 new -> directory를 통해 resources 디렉토리를 만듭니다.
+ 디렉토리 안에 application.properties를 생성하고, 노션에 있는 설정 값을 불러옵니다.
+ docker를 킵니다. -> docker pull rabbitmq -> `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq` 를 통해 rabbitmq를 실행시키고 채팅 서버를 실행합니다.


### 그 외 설정

설정 파일(application.properties)에 문자가 깨진다면, `File` -> `Settings` -> `File Encodings` -> `Default encoding for properties` 를 UTF-8 로 바꾸고 적용하세요   

## 기여 방법
기여하고 싶은 분들은 [기여 가이드](CONTRIBUTING.md)를 참고하세요.

겉멋으로 넣었스빈다

## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.

## 문의
문의사항이 있으면 [이메일](rjsqktod1@gmail.com)로 연락해주세요.
