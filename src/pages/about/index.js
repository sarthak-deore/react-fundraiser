import React from 'react';

// COMPOENENTS
import PageBanner from '../../components/general/PageBanner';

function AboutUsPage() {
    return (
        <>
            <PageBanner
                heading='About Us'
                text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, similique pariatur et corporis'
            ></PageBanner>

            <section className='pb-5'>
                <div className='container pb-5'>
                    <div className='row'>
                        <div className='col-lg-10 mx-auto'>
                            <div className='row gy-4 gx-5 justify-content-between'>
                                <div className='col-lg-4'>
                                    <h2>Some words about</h2>
                                    <p className='text-muted'>Web3 Monkeys launched 1 April 2020</p>
                                </div>
                                <div className='col-lg-4'>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime ut cupiditate
                                        asperiores tempore itaque, impedit dignissimos eaque deserunt reiciendis omnis.
                                    </p>
                                </div>
                                <div className='col-lg-4'>
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi exercitationem
                                        atque architecto dicta fugiat blanditiis laborum sint porro vel unde. Nostrum
                                        laudantium quis incidunt magnam quidem ratione totam deserunt facilis!
                                    </p>
                                    <h5 className='text-primary mb-0'>Web3 Monkeys</h5>
                                    <p className='text-muted'>Web3 Monkeys CEO</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-5 bg-darker'>
                <div className='container py-5'>
                    <header className='mb-5 text-center'>
                        <h2 className='h1'>Top Features</h2>
                        <p className='text-muted'>Top 3 Features in our app that are unrivaled!</p>
                    </header>
                    <div className='row'>
                        <div className='col-lg-10 mx-auto'>
                            <div className='row g-4 text-center'>
                                <div className='col-lg-4'>
                                    <div className='card mb-0 p-lg-4 shadow-0'>
                                        <div className='card-body'>
                                            <h4>Decentralized</h4>
                                            <p className='text-muted mb-0'>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quidem
                                                quis architecto suscipit culpa assumenda ratione.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='card mb-0 p-lg-4 shadow-0'>
                                        <div className='card-body'>
                                            <h4>Easy Money Transfer</h4>
                                            <p className='text-muted mb-0'>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quidem
                                                quis architecto suscipit culpa assumenda ratione.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-4'>
                                    <div className='card mb-0 p-lg-4 shadow-0'>
                                        <div className='card-body'>
                                            <h4>Freindly User Interface</h4>
                                            <p className='text-muted mb-0'>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quidem
                                                quis architecto suscipit culpa assumenda ratione.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-5'>
                <div className='container text-center py-5'>
                    <div className='row'>
                        <div className='col-lg-6 mx-auto'>
                            <p className='h3 fw-light'>
                                "With Web3 Monkeys we are already in the future, first of all."
                            </p>
                            <h5 className='text-primary'>Hasan</h5>
                            <p className='text-muted'>Web3 Monkeys, CEO</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AboutUsPage;
