import React from 'react';
import { appSettings } from '../../helpers/settings';
import { HiOutlinePresentationChartBar } from 'react-icons/hi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

function RecentFundraises() {
    return (
        <>
            <section className='py-5 bg-dark'>
                <div className='container py-5'>
                    <div className='row g-5 align-items-center'>
                        <div className='col-lg-6 text-center'>
                            <div className='d-inline-block'>
                                <div className='oval-holder'>
                                    <img src='/about-img.jpg' alt='About us' className='img-fluid oval' width='400' />
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6'>
                            <p className='h4 mb-0 text-primary'>Get to Know {appSettings.brandName}</p>
                            <h2 className='h1'>Fund the Next Big Thing</h2>
                            <p className='text-muted mb-4'>
                                There are many variations of passages of Lorem Ipsum available, but the majority have
                                suffered alteration in some form, or randomised words which don't look even slightly.
                            </p>

                            <div className='row'>
                                <div className='col-xl-8'>
                                    <ul className='list-unstyled'>
                                        <li className='d-flex align-items'>
                                            <div className='icon icon-lg'>
                                                <HiOutlinePresentationChartBar size={25} />
                                            </div>
                                            <div className='ms-3'>
                                                <h5>Highest Success Rates</h5>
                                                <p className='text-sm text-muted'>
                                                    Lorem Ipsum velit auctor aliquet. Aenean sollic tudin, lorem is
                                                    simply free text quis bibendum.
                                                </p>
                                            </div>
                                        </li>
                                        <li className='d-flex align-items'>
                                            <div className='icon icon-lg'>
                                                <RiMoneyDollarCircleLine size={25} />
                                            </div>
                                            <div className='ms-3'>
                                                <h5>Millions in funding</h5>
                                                <p className='text-sm text-muted'>
                                                    Lorem Ipsum velit auctor aliquet. Aenean sollic tudin, lorem is
                                                    simply free text quis bibendum.
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default RecentFundraises;
