# Sample de API em NodeJS com TypeScript

    Web Service RESTFull

-   Log de chamadas HTTP ([Express Morgan](https://github.com/expressjs/morgan#readme))
-   Sistema de logging com armazenamento ([Winston](https://github.com/winstonjs/winston#readme))
-   Manipulação de banco de dados com Entidades ([TypeORM](https://typeorm.io/#/))
-   Design baseado em Model, Service, Controller e injeção de dependencias ([routing-controllers](https://github.com/typestack/routing-controllers#readme) e [TypeDI](https://github.com/typestack/typedi#readme))
-   Auto Documentação ([Sweagger](https://swagger.io/) - [OpenAPI](https://www.openapis.org/) [para Routing controllers](https://github.com/epiphone/routing-controllers-openapi#readme))
-   Testes unitários ([Jest](https://jestjs.io/pt-BR/))

## A fazer

-   Adicionar Linter de commit ([Husky](https://typicode.github.io/husky/#/))

-   Adicionar Teste Unitário

## Instalação

    yarn install

## Depuração

    yarn dev

Também é possivel depurar o projeto com VSCode Debug. Pressione F5 ou acesse a aba `Run and Debug`.

## Build

    yarn build

## Build com docker

    $ docker build . -t {nome da imagem}
