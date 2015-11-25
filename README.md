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


# Instalando APK

Faça o build da aplicação:

    ionic build --release android


# Testando no celular

Execute o comando:

    `cd platforms/android/build/outputs/apk && python -m SimpleHTTPServer`

Abra o link pelo seu celular, usando o IP do seu computador e escolha a APK gerada e clique em download.

# Testando no ilab

    ionic serve --lab
