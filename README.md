# GE ZFP App for Chrome

## How it works

Using Chrome packaged app technology with `url_handlers` to match `*://*/ZFP[/?]*` globally, and display into a webview with any URL or parameter updates, also hide URL address bar and disable right click in the context area to protect PACS images data.

## How to install

First, following Google Chrome Web Store Developer policy, any `url_handlers` must be in a validated domain, but we set to `*://*/` will be disapproval on the Chrome Web Store.

Second, there is no way to install on the click just like Chrome Web Store, unless install Chrome by the Enterprise Group Policy.

### Install manually

1. Download from [this link](https://cdn.rawgit.com/Haraguroicha/GE-ZFP-App/master/GE-ZFP-App.crx)
2. Goto [Extensions Page](chrome://extensions)
3. Drag and Drop downloaded file into Chrome Extensions Page
4. Done

### Install by Group Policy

1. Open Group Policy Editor `gpmc.msc`
2. Navigate to Chrome Policy
3. Add `iceghkpmaeoiomhkfjpcjjmmclihiejg;https://raw.githubusercontent.com/Haraguroicha/GE-ZFP-App/master/version.xml` into `ExtensionInstallForcelist`
4. (Optional) Add `https://raw.githubusercontent.com/Haraguroicha/*` into `ExtensionInstallSources`
5. Execute `gpupdate` or restart client PC to effect this changes.
6. Chrome will have a non-removable app in the Extensions page with display `Installed by enterprise policy.` and also `(This extension is managed and cannot be removed or disabled.)`

## SPECIAL AND LICENSED TRADEMARKS AND/OR COPYRIGHTS

- For `GE Logo` is a trademark of `General Electric Company`
