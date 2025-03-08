import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appSettings } from '../helpers/settings';

function NotFound({ customMsg }) {
    /* --------------------------------------------- 
          CHANGE PAGE TITLE
    --------------------------------------------- */
    useEffect(() => {
        document.title = `${appSettings.brandName} | Unauthorized`;
    }, []);

    return (
        <>
            <div className='row py-5 gy-5 text-center'>
                <div className='col-lg-8 mx-auto pt-5'>
                    <div data-aos='fade-up'>
                        <img
                            src='/403.svg'
                            alt='Fox'
                            className='img-fluid w-100 my-5 pt-5'
                            style={{ maxWidth: '550px' }}
                        />
                    </div>
                    {customMsg || (
                        <>
                            <h1 data-aos='fade-up' data-aos-delay='100' className='text-xl'>
                                Unauthorized
                            </h1>
                            <p className='text-muted lead' data-aos='fade-up' data-aos-delay='200'>
                                You are not allowed to access this page.
                            </p>
                            <Link className='btn btn-primary py-2' to='/'>
                                Return Home
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default NotFound;
