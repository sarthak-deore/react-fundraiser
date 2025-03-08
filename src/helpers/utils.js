/* -----------------------------------------------------------------------------------------

    THSI FILE CONTAINS SOME HELPER FUNCTIONS USED IN DIFFERENT PLACED IN THE APP

----------------------------------------------------------------------------------------- */
import Axios from 'axios';
import { appSettings } from './settings';

// FORMATE DATE WITH HOURS AND MINUTES - [DD/MM/YYYY HH:MM]
export function formatDate(date) {
    return `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()} ${new Date(
        date
    ).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
}

// FORMATE DATE IN A SIMPLE FORMATE [DD/MM/YYYY]
export function formatSimpleDate(date) {
    return `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()}`;
}

// FORMATE DATE IN A SIMPLE FORMATE [DD/MM/YYYY]
export function formatDashedDate(date) {
    const day = new Date(date).getDate()?.length > 1 ? new Date(date).getDate() : `0${new Date(date).getDate()}`;
    const month =
        (new Date(date).getMonth() + 1)?.length > 1
            ? new Date(date).getMonth() + 1
            : `0${new Date(date).getMonth() + 1}`;
    const year = new Date(date).getFullYear();

    return `${year}-${month}-${day}`;
}

// TRUNCATE LONG STRINGS ONLY FROM ONE SIDE
export function truncateStart(fullStr, strLen, separator) {
    if (fullStr?.length <= strLen) return fullStr;
    separator = separator || '...';
    let charsToShow = strLen,
        frontChars = Math.ceil(charsToShow);

    return fullStr?.substr(0, frontChars) + separator;
}

// TRUNCATE THE LONG STRINGS FROM THE MIDDLE
export function truncate(fullStr, strLen, separator) {
    if (fullStr?.length <= strLen) return fullStr;

    separator = separator || '...';

    var sepLen = separator?.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return fullStr?.substr(0, frontChars) + separator + fullStr?.substr(fullStr?.length - backChars);
}

// NAVBAR FIXED TOP BEHAVIOR
export function fixNavbarToTop() {
    window.addEventListener('scroll', () => {
        const wScrollTop = window.pageYOffset;
        if (wScrollTop > 0) {
            document.querySelector('.navbar').classList.add('active');
        } else if (wScrollTop <= 0) {
            document.querySelector('.navbar').classList.remove('active');
        }
    });
}

// CALCULATE THE VIDEO DURATION IN HOURS/MINUTES/SECONDES
export function secondsToHms(durationInSeconds) {
    const hours = Math.floor(Number(durationInSeconds) / 3600);
    const minutes = Math.floor((Number(durationInSeconds) % 3600) / 60);
    const seconds = Math.ceil(Number(durationInSeconds) % 60);

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

// REDIRECT USER TO BLOCK SCAN EXPLORER ACCORDING TO THE NETWORK HE'S CONNECTED TO
export function configEtherScanUrl(network, account) {
    let blockExplorerUrl;
    if (network === 3) {
        blockExplorerUrl = 'https://ropsten.etherscan.io';
    } else if (network === 1) {
        blockExplorerUrl = 'https://etherscan.io';
    } else if (network === 4) {
        blockExplorerUrl = 'https://rinkeby.etherscan.io';
    } else if (network === 42) {
        blockExplorerUrl = 'https://kovan.etherscan.io';
    } else if (network === 5) {
        blockExplorerUrl = 'https://goerli.etherscan.io';
    } else if (network === 56) {
        blockExplorerUrl = 'https://bscscan.com';
    } else if (network === 137) {
        blockExplorerUrl = 'https://polygonscan.com';
    } else if (network === 97) {
        blockExplorerUrl = 'https://testnet.bscscan.com';
    } else if (network === 44787) {
        blockExplorerUrl = 'https://alfajores.celoscan.xyz/';
    } else if (network === 80001) {
        blockExplorerUrl = 'https://mumbai.polygonscan.com';
    } else {
        blockExplorerUrl = 'https://bscscan.com';
    }

    return `${blockExplorerUrl}/address/${account}`;
}

export function toBlockExplorer(type, address) {
    return `${appSettings?.blockExplorerUrl}/${type}/${address}`;
}

// FORMSPREE SENDING MAIL FUNCTION
export async function sendFormData(frm, endpoint, success, failing, startloading, stopLoading) {
    startloading();
    try {
        await Axios.post(`https://formspree.io/f/${endpoint}`, new FormData(frm), {
            headers: {
                Accept: 'application/json',
            },
        });
        success();
        stopLoading();
    } catch (error) {
        console.log(error);
        failing();
        stopLoading();
    }
}

// FORMATE STRINGS [CAPITALIZING IT]
export function formatString(str) {
    str = str.replace(/\b\w/g, (c) => c.toUpperCase());
    str = str.replace(/_/g, ' ');
    return str;
}

// CREATE SLUG FROM ITEM NAME
export function createSlug(text) {
    return text ? text.replace(/\s+/g, '-').toLowerCase() : '';
}

// CALCULATE THE VENDOR RATING FROM HIS SHOPS RATINGS
export function calculateVendorRating(products) {
    let totalRating = 0;
    const newProducts = products.filter((prod) => prod.productRating !== 0);
    let numProducts = newProducts.length;

    for (let i = 0; i < numProducts; i++) {
        totalRating += newProducts[i].productRating;
    }

    let vendorRating = (totalRating / (numProducts * 5)) * 5;

    if (numProducts > 0) {
        return vendorRating;
    } else {
        return 0;
    }
}

// CALCULATE SHOP RATINGS FROM ITS PRODUCTS RATINGS
export function calculateSellerRating(products) {
    let totalRating = 0;
    let numProducts = products.length;

    for (let i = 0; i < numProducts; i++) {
        totalRating += products[i].shopRating;
    }

    let vendorRating = (totalRating / (numProducts * 5)) * 5;

    if (numProducts > 0) {
        return vendorRating;
    } else {
        return 0;
    }
}

export function selectInputText(event) {
    // Get the input element that was focused
    const input = event.target;

    // Set the selection range to include all of the input's text
    input.select();
}

export function humanize(str) {
    var i,
        frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}
