android-dev:
	ionic run android -c -l -s

devices-list:
	adb devices -l

lab-mode:
	ionic serve --lab

install:
	bower install
	npm install

