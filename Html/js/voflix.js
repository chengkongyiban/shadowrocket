var body = $response.body
    .replace(/<head>/, '<head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/chengkongyiban/shadowrocket@main/Html/css/voflix.css" type="text/css">');
$done({ body });
