<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">

<head>
  <meta charset="utf-8" />
  <title>React System Admin</title>
  <meta name="description" content="React System Admin" />
  <meta name="robots" content="noarchive,index,follow" />
  <link id="canonical" rel="canonical" href="https://react.dev" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
    rel="stylesheet"
  />
  <link href="/assets/styles/theme.css" rel="stylesheet" />
  <meta
    content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=1"
    name="viewport"
  />
  <meta http-equiv="X-UA-Compatible" content="IE=100" />
  <meta name="mobile-web-app-capable" content="yes" />

  <base href="/" />
  <link rel="icon" type="image/x-icon" href="favicon.ico" />
  <link rel="apple-touch-icon" href="assets/icons/logo192.png" />
  <link rel="apple-touch-icon" href="assets/icons/logo512.png" />
  <link rel="manifest" href="manifest.webmanifest" />
  <meta name="theme-color" content="#2563eb" />
  <script type="text/javascript" src="/assets/library/inputmask/inputmask.min.js"></script>
  <link rel="stylesheet" href="/assets/library/glightbox/glightbox.min.css" />
  <script type="text/javascript" src="/assets/library/glightbox/glightbox.min.js"></script>
  <script type="text/javascript" src="/assets/library/suneditor/suneditor.min.js"></script>
  <link href="/assets/library/suneditor/suneditor.min.css" rel="stylesheet" />
  <script type="text/javascript" src="/assets/library/echarts/echarts.min.js"></script>
  <link href="/assets/library/nprogress/nprogress.css" rel="stylesheet" />
  <script type="text/javascript" src="/assets/library/nprogress/nprogress.js"></script>
  <script>
    NProgress.configure({  easing: "ease",speed: 500,showSpinner: true,trickleSpeed: 200,minimum: 0.3 })
  </script>

  @viteReactRefresh
  @vite(['resources/js/main.tsx'])
</head>

<body>
<div id="app"></div>
</body>

</html>

