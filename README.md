# Dependências

    Execute o arquivo `ubuntu_ionic_installer.sh`

# Iniciando o projeto

    Faça o clone desse projeto e adicione a plataforma Android

        ionic platform add android


# Configurações

Configurações gerais para versões antigas.
    - Alterar api version `android-minSdkVersion` no android/CordovaLib


# Instalando APK

Faça o build da aplicação:

    ionic build android

# Testando no celular

Execute o comando:

    `cd platforms/android/build/outputs/apk && python -m SimpleHTTPServer`

Abra o link pelo seu celular, usando o IP do seu computador e escolha a APK gerada e clique em download.


Para usar a versão feita em go, execute:

    make build-in-android

* Para executar o build e servir os arquivos estáticos com a versão do Makefile é preciso
ter o Go instalado*


# Executando direto no celular

    * Ative o DEBUG por USB no seu celular
    * Altere o `/etc/udev/rules.d/50-android.rules`
        https://raw.githubusercontent.com/NicolasBernaerts/ubuntu-scripts/master/android/51-android.rules
    * Reinicie o serviço `service udev restart`
    * Agora seu device ja deve aparecer no `make devices-list`
    * Execute o `make android-dev` e seu aplicativo deve iniciar

# Testando no ilab

    make lab-mode


# Debug no Chrome

    * Tenha o DEBUG ativado por USB
        * Você pode checar com o `make devices-list`
    * Abra o console do Navegador
    * Procure por "Inspect Devices"
    * Encontre o Device na listagem
    * Clique em "Inspect"


# TODO

    [x] Salvar Latitude e Longitude
    [x] Iniciar e parar dependendo do USB está conectado
    [x] Senha para Pausar manualmente
    [ ] Sincronização
