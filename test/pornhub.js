var body = $response.body
    .replace(/<head>/, '<head><link rel="stylesheet" href="https://raw.githubusercontent.com/chengkongyiban/shadowrocket/main/test/pornhub.css" type="text/css">');
$done({ body });
