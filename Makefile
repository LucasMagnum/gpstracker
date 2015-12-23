android-dev:
	ionic run android -c -l -s

build-in-android:
	cordova build android
	go run app-server.go

devices-list:
	adb devices -l

lab-mode:
	ionic serve --lab

install:
	bower install
	npm install

