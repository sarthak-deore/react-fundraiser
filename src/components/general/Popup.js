import React from 'react';

const Popup = ({ children, closeModal, containerClass }) => {
    return (
        <div
            className='fullscreen-loader'
            data-aos='zoom-in-up'
            data-aos-duration='100'
            onClick={() => closeModal(false)}
        >
            <div className='fullscreen-loader-inner p-md-4 modal'>
                <div className='container'>
                    <div className='row mt-4'>
                        <div className={`${containerClass || 'col-lg-8'}  mx-auto`}>
                            <div
                                className='card shadow position-relative'
                                style={{ maxHeight: '80vh', overflowY: 'scroll' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className='position-absolute m-3 top-0 end-0'>
                                    <button
                                        className='btn btn-dark btn-sm z-index-20'
                                        type='button'
                                        onClick={() => closeModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                                <div className='card-body p-4 p-lg-5'>{children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;
