import React from 'react';
import { categories } from '../../helpers/constants';
import { Link } from 'react-router-dom';

function HomeCategories() {
    return (
        <>
            <div className='intro-banner bg-dark py-5'>
                <div className='container py-5'>
                    <header className='row g-4 align-items-center mb-5'>
                        <div className='col-lg-7 mx-auto text-center'>
                            <p className='lead mb-0 text-primary'>Ready to Go?</p>
                            <h2 className='h1 text-white mb-0'>Browser By Category</h2>
                        </div>
                    </header>

                    <div className='row g-2'>
                        {categories?.map((category, index) => {
                            return (
                                <div className='col-xxl-2 col-lg-4 col-6' key={index}>
                                    <Link to={`/campaigns/category/${category?.value}`} className='text-reset'>
                                        <div className='card mb-0'>
                                            <div className='card-body text-center'>
                                                <div className='mb-2 text-primary'>{category?.icon}</div>
                                                <h5>{category?.label}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeCategories;
