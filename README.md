# Dependências

    Execute o arquivo `ubuntu_ionic_installer.sh`

# Iniciando o projeto

    ionic startapp <myproject> blank
    ionic platform add android

    Atualize com os arquivos do repositório

# Configurações

Configurações gerais para versões antigas.
    - Alterar api version `android-minSdkVersion` no config.xml
    - Alterar api version `android-minSdkVersion` no android/CordovaLib

# Instalando dependencias

    `bower install`
    `npm install`
    `cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git`
    `cordova plugin add org.apache.cordova.battery-status`


# Instalando APK

Faça o build da aplicação:

    ionic build --release android


# Testando no celular

Execute o comando:

    `cd platforms/android/build/outputs/apk && python -m SimpleHTTPServer`

Abra o link pelo seu celular, usando o IP do seu computador e escolha a APK gerada e clique em download.

# Executando direto no celular

    * Ative o DEBUG por USB no seu celular
    * Altere o `/etc/udev/rules.d/50-android.rules`
        https://raw.githubusercontent.com/NicolasBernaerts/ubuntu-scripts/master/android/51-android.rules
    * Reinicie o serviço `service udev restart`
    * Agora seu device ja deve aparecer no `adb devices -l`
    * Execute o `ionic run android` e seu aplicativo deve iniciar

# Testando no ilab

    ionic serve --lab



# TODO

    [x] Salvar Latitude e Longitude
    [x] Iniciar e parar dependendo do USB está conectado
    [ ] Senha para Pausar manualmente
    [ ] Sincronização
