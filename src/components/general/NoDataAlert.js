import React from 'react';
import { TbBrandAirtable } from 'react-icons/tb';

function NoDataAlert({ text }) {
    return (
        <>
            <div className='text-center'>
                <div className='d-inline-block'>
                    <div className='card mb-0'>
                        <div className='card-body'>
                            <p className='mb-0 d-flex align-items-center text-muted'>
                                <TbBrandAirtable className='text-primary me-2' size='1.4rem' />
                                {text}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NoDataAlert;
