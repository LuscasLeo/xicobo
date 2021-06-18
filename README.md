# XicoBô

    Whatsapp ChatBot e WebService

Chatbot feito em NodeJS com uso do [Venom Bot](https://github.com/orkestral/venom) e [LuscasLeo/sample-restful-webservice](https://github.com/LuscasLeo/sample-restful-webservice)

## Chrome Driver

É necessário configurar o chrome driver de acordo com seu sistema operacional e configurações locais.

## VSCode Remote Container

É possivel usar um ambiente virtualizado no [Docker](https://www.docker.com/get-started), com <b>Chrome Driver já configurado,</b> dentro do [VSCode](https://code.visualstudio.com/download) usando a extensão [Remote Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) Após a instalação, use a opção `Remote-Containers: Open Folder in Container...` (http://prntscr.com/15t9by9)

## Instalação

    yarn install

## Depuração

    yarn dev

Também é possivel depurar o projeto com VSCode Debug. Pressione F5 ou acesse a aba `Run and Debug`.

## Build

    yarn build

## Build com docker

    $ docker build . -t {nome da imagem}
