# Youtube User Tracker Remover (YUTR?)  
  
Removes the user tracking portion of YouTube links copied via the "Share -> Copy" button, on both 'youtube.com' and 'youtu.be' links.  
  
## What it removes  
  
**Always removed** (pure tracking/metadata - never affects playback):  
- feature  
- ab_channel  
- pp  
- app  
- source_ve_path  
- gclid  
- list (playlist ID)  
- index (position within playlist)  
  
**Toggle-controlled** (click the extension icon to open the popup):  
- si - tracking ID identifying who shared the link. On by default.  
- t / start - video timestamp (where playback starts). On by default.  
- Prefix - adds prefix text before the copied link. Off by default, text defaults to "!!p " but is editable in the popup. (the 'space' after prefix needs to be typed, too.)  
  
Toggle changes are applied right away by a shared setting.  
If the setting does not get applied, the popup also has a 'Reload current YouTube tab' button for "quick" reload.  
  
## Install
  
1. Unzip this folder.  
2. Open 'chrome://extensions' in Chrome.  
3. Turn on 'Developer mode'.  
4. Click 'Load unpacked'.  
5. Select the extracted folder.   
   - To test out, go to any YouTube video, click 'Share -> Copy', and paste.  

## Debugging

1. Open a YouTube video.
2. Open DevTools -> Console tab.
3. Reload the page. You should see: '[Youtube User Tracker Remover] active'
   - If you don't see this, the script isn't loading -> check 'chrome://extensions' for a red "Errors" button on the extension card.
4. Click Share -> Copy on a video.
5. If the URL gets changed, you'll see a log line like: '[Youtube User Tracker Remover] parameter(s) cleaned: https://youtu.be/asdf?si=usertacker -> https://youtu.be/asdf'
   - If you don't see this log line, the copy action isn't going through.
