const BASE_URL = 'http://localhost:8078/';
const { clipboard, nativeImage } = require('electron')
import axios from 'axios';
var lodash = require('lodash');
var log = require('loglevel');
log.setLevel('silent');
const icons = {
	'default': require('../icons/_blank.png'),
	'aac': require('../icons/aac.png'),
	'ai': require('../icons/ai.png'),
	'aiff': require('../icons/aiff.png'),
	'avi': require('../icons/avi.png'),
	'bmp': require('../icons/bmp.png'),
	'c': require('../icons/c.png'),
	'cpp': require('../icons/cpp.png'),
	'css': require('../icons/css.png'),
	'csv': require('../icons/csv.png'),
	'dat': require('../icons/dat.png'),
	'dmg': require('../icons/dmg.png'),
	'doc': require('../icons/doc.png'),
	'docx': require('../icons/doc.png'),
	'dot': require('../icons/dotx.png'),
	'dotx': require('../icons/dotx.png'),
	'dwg': require('../icons/dwg.png'),
	'dxf': require('../icons/dxf.png'),
	'eps': require('../icons/eps.png'),
	'exe': require('../icons/exe.png'),
	'flv': require('../icons/flv.png'),
	'gif': require('../icons/gif.png'),
	'h': require('../icons/h.png'),
	'hpp': require('../icons/hpp.png'),
	'htm': require('../icons/html.png'),
	'html': require('../icons/html.png'),
	'ics': require('../icons/ics.png'),
	'iso': require('../icons/iso.png'),
	'java': require('../icons/java.png'),
	'jpg': require('../icons/jpg.png'),
	'js': require('../icons/js.png'),
	'key': require('../icons/key.png'),
	'less': require('../icons/less.png'),
	'mid': require('../icons/mid.png'),
	'mp3': require('../icons/mp3.png'),
	'mp4': require('../icons/mp4.png'),
	'mpg': require('../icons/mpg.png'),
	'odf': require('../icons/odf.png'),
	'ods': require('../icons/ods.png'),
	'odt': require('../icons/odt.png'),
	'otp': require('../icons/otp.png'),
	'ots': require('../icons/ots.png'),
	'ott': require('../icons/ott.png'),
	'pdf': require('../icons/pdf.png'),
	'php': require('../icons/php.png'),
	'png': require('../icons/png.png'),
	'ppt': require('../icons/ppt.png'),
	'psd': require('../icons/psd.png'),
	'py': require('../icons/py.png'),
	'qt': require('../icons/qt.png'),
	'rar': require('../icons/rar.png'),
	'rb': require('../icons/rb.png'),
	'rtf': require('../icons/rtf.png'),
	'sass': require('../icons/sass.png'),
	'scss': require('../icons/scss.png'),
	'sql': require('../icons/sql.png'),
	'tga': require('../icons/tga.png'),
	'tgz': require('../icons/tgz.png'),
	'tiff': require('../icons/tiff.png'),
	'txt': require('../icons/txt.png'),
	'wav': require('../icons/wav.png'),
	'xls': require('../icons/xls.png'),
	'xlsx': require('../icons/xlsx.png'),
	'xml': require('../icons/xml.png'),
	'yml': require('../icons/yml.png'),
	'zip': require('../icons/zip.png')
}

var searchcode_axios = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

var async_handle_event = async function (search_content, actions, display, hide){
    log.debug('start to fetch data');
    
    if (!search_content || search_content.length <=0) {
        log.debug('hide fetch item');
        hide('everythingfetch');
        return;
    }
    let els = {lastVal:"",valHistory:"",valRegs:[]};
    let response ={};
    
    response = await searchcode_axios.get('/',{
        params:{
        	search: search_content
        }
    });

	  let parser = new DOMParser()
    let doc = parser.parseFromString(response.data, 'text/html')
    var first = true;
    doc.querySelectorAll("tr.trdata1,tr.trdata2").forEach(function (tr) {
    	log.debug(tr)
    	if (first) {
        hide('everythingfetch'); 
        first = false
      }

      var filename = tr.firstChild.textContent
      var alink = decodeURIComponent('file://' + tr.firstChild.querySelector("a").getAttribute('href'))
      var icon = icons[filename.split('.').reverse()[0]] || icons['default']
      log.debug(alink)
      
      display({
      		icon: icon,
          title: filename,
          onSelect:()=>{
          	actions.open(alink)
            actions.hideWindow()
          }
      });
    });
    
    return;
}

var handle_event = lodash.throttle((search_content,actions,display,hide)=>{async_handle_event(search_content,actions,display,hide);},
                                   3000,{ 'trailing': true });

export const fn = ({ term, actions, display, hide }) => {
    // Put your plugin code here
    if (term.startsWith("'")) term = term.substr(1)
    log.debug(`Searching for ${term}`);
    display({
        title: "Searching Everything...",
        id:'everythingfetch'
    });
    handle_event(term, actions, display, hide);
};
