import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { BiRightArrowAlt, BiLeftArrowAlt } from 'react-icons/bi';
import { useParams } from 'react-router-dom';

// HOOKS
import useCampaign from '../../hooks/useCampaign';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import FundraiseCard from '../../components/general/FundraiseCard';

function CategoryPage() {
    const { allCampaigns } = useCampaign();
    const [dateFilter, setDateFilter] = useState({ label: 'Newest First', value: 'newest' });
    const { category } = useParams();

    const categorizedCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => camp.category === category);
    }, [category, allCampaigns]);

    function handleDateFilter(val) {
        setDateFilter(val);
    }

    // PAGINATION VARIABLES ---------------------------------
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 12;
    const endOffset = itemOffset + itemsPerPage;
    const pageCount = Math.ceil(categorizedCampaigns?.length / itemsPerPage);

    /* --------------------------------------------- 
          MOVE BETWEEN PAGES
    --------------------------------------------- */
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % categorizedCampaigns?.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <PageBanner
                heading={`${category} Campaigns`}
                text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, similique pariatur et corporis'
            ></PageBanner>
            <section className='pb-5 z-index-20'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-8 mx-auto' data-aos='fade-up'>
                            <ul className='list-inline d-flex justify-content-center flex-wrap z-index-20'>
                                <li className='list-inline-item me-3 my-2'>
                                    <label htmlFor='dateSort' className='form-label'>
                                        Sort by Date
                                    </label>

                                    <Select
                                        options={[
                                            { label: 'Newest First', value: 'newest' },
                                            { label: 'Oldest First', value: 'oldest' },
                                        ]}
                                        className='border-0 shadow-sm'
                                        classNamePrefix='select'
                                        placeholder='Select'
                                        onChange={(value) => handleDateFilter(value)}
                                        isSearchable={false}
                                        value={dateFilter}
                                        autosize={true}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className='pb-5'>
                <div className='container pb-5'>
                    <div className='row justify-content-center gy-4'>
                        {categorizedCampaigns?.length > 0 ? (
                            categorizedCampaigns
                                .sort((a, b) => {
                                    if (dateFilter.value === 'newest') {
                                        return b?.id - a?.id;
                                    } else {
                                        return a?.id - b?.id;
                                    }
                                })
                                ?.slice(itemOffset, endOffset)
                                ?.map((camp) => {
                                    return (
                                        <div className='col-xxl-3 col-lg-4 col-md-6' key={camp.id}>
                                            <FundraiseCard {...camp} />
                                        </div>
                                    );
                                })
                        ) : (
                            <div className='col-12 text-center'>
                                <div className='d-inline-block'>
                                    <p className='glass-bg p-3 mb-0 text-center'>There're no campaigns at the moment</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {categorizedCampaigns?.length > 0 && (
                        <div className='react-pagination mt-4 justify-content-center'>
                            <ReactPaginate
                                breakLabel='...'
                                nextLabel={<BiRightArrowAlt />}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={pageCount}
                                previousLabel={<BiLeftArrowAlt />}
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default CategoryPage;
