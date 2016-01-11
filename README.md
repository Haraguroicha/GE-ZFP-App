# GE ZFP App for Chrome

## How it works

Using Chrome packaged app technology with `url_handlers` to match `*://*/ZFP[/?]*` globally, and display into a webview with any URL or parameter updates, also hide URL address bar and disable right click in the context area to protect PACS images data.

## How to install

First, following Google Chrome Web Store Developer policy, any `url_handlers` must be in a validated domain, but we set to `*://*/` will be disapproval on the Chrome Web Store.

Second, there is no way to install on the click just like Chrome Web Store, unless install Chrome by the Enterprise Group Policy.

### Install manually

1. Download from [this link](https://github.com/Haraguroicha/GE-ZFP-App/raw/master/GE-ZFP-App.crx)
2. Goto [Extensions Page](chrome://extensions)
3. Drag and Drop downloaded file into Chrome Extensions Page
4. Done

### Install by Group Policy

1. Open Group Policy Editor `gpmc.msc`
2. Navigate to Chrome Policy
3. Add `iceghkpmaeoiomhkfjpcjjmmclihiejg;https://github.com/Haraguroicha/GE-ZFP-App/raw/master/version.xml` into `ExtensionInstallForcelist`
4. (Optional) Add `https://github.com/Haraguroicha/*` into `ExtensionInstallSources`
5. Execute `gpupdate` or restart client PC to effect this changes.
6. Chrome will have a non-removable app in the Extensions page with display `Installed by enterprise policy.` and also `(This extension is managed and cannot be removed or disabled.)`

### Reverse Proxy from private nginx server

Only use when your enterprise is managed without internet connection, and you can set `version.xml` URL to `iceghkpmaeoiomhkfjpcjjmmclihiejg;https://private-server-node/version.xml` and here is the example of nginx configuration:

```nginx
    location /_crx/GE-ZFP-App/ {
        proxy_set_header Host raw.githubusercontent.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Accept-Encoding "";
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504 http_403 http_404;
        proxy_pass https://raw.githubusercontent.com/Haraguroicha/GE-ZFP-App/master/;
        sub_filter 'https://github.com/Haraguroicha/GE-ZFP-App/raw/master/' 'https://private-server-node/_crx/GE-ZFP-App/';
        sub_filter_last_modified on;
        sub_filter_once on;
        sub_filter_types text/plain;
    }
```

## SPECIAL AND LICENSED TRADEMARKS AND/OR COPYRIGHTS

- For `GE Logo` is a trademark of `General Electric Company`
