android-dev:
	ionic run android -c -l -s

build-in-android:
	ionic build android
	go run app-server.go

devices-list:
	adb devices -l

lab-mode:
	ionic serve --lab -c -l -s

install:
	bower install
	npm install

