# Toyota Frontend React Project

This project is developed for 32Bit's Toyota frontend developer contest. The purpose of this application is to list factory terminals, list faults and be able to enter faults specifying a location on image.

## Getting Started

```sh
npm install
npm run dev
```

## Usage

Use the following credentials for a successful login.\
`Sicil No: 99619`\
`Password: 1234`

## Technical Decisions

While developing this application I tried my best to use the most up-to-date standard tools preferred by developers and enterprises.

### Typescript

Utilizing TypeScript is anticipated to significantly enhance the developer experience (DX). The extensive library support for TypeScript allows integrated development environments (IDEs) to provide comprehensive autocomplete functionality, akin to developing in a statically typed language. This improvement in DX is expected to streamline development processes and reduce overall development time.

### Tanstack Router for Routing

I chose Tanstack router because of it's flexibility, first class typescript support, easy to use API and the clean project structure that it permits.

### MSWJS.io

**Mock Service Worker** is an API mocking library that allows us to write client-agnostic mocks and reuse them across any environments. It works by intercepting http request in Browser's service worker. By using mock service worker we are able to mock api without adding any adapters in our code. and without having to create a mock database in our environment.

### Other

- **react-query** for state management.
- **react-select** for our custom select component.
![alt text](image.png)
- **react-hook-form**
- **react-table** and **react-virtual** for faults page.
![alt text](image-1.png)
- **Axios**

## Roadmap

- [ ] Add tests
- [ ] Add i18n
- [ ] Add virtual keyboard

## Acknowledgments

Thanks to [@TannerLinsley](https://twitter.com/tannerlinsley) for his contributions to the React community, including his outstanding libraries and educational resources that have greatly empowered me to build better React applications.
