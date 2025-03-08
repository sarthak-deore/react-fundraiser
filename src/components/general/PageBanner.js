import React, { useEffect } from 'react';
import { appSettings } from '../../helpers/settings';

function PageBanner({ heading, text, children }) {
    /* ----------------------------------------------------- 
       CHANGE PAGE TITLE ACCORDING TO THE BANNER TITLE
    ----------------------------------------------------- */
    useEffect(() => {
        document.title = `${appSettings.brandName} | ${heading}`;
    }, [heading]);

    return (
        <>
            <section className='hero-banner'>
                <div className='hero-banner-bg'></div>
                <div className='container z-index-20 hero-banner-container is-page'>
                    <div className='text-center w-100'>
                        <h1>{heading}</h1>
                        <p className='text-muted' data-aos='fade-up' data-aos-delay='100'>
                            {text}
                        </p>
                        <div data-aos='fade-up' data-aos-delay='200'>
                            {children}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default PageBanner;
