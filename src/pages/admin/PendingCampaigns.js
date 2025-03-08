import React, { useMemo } from 'react';
import { FaUncharted } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatDate, truncateStart } from '../../helpers/utils';
import DataTable from 'react-data-table-component';

// HOOKS
import useCampaign from '../../hooks/useCampaign';

function PendingCampaigns() {
    const { allCampaigns } = useCampaign();

    /* --------------------------------------------- 
          GET ALL WAITING FOR APPROVAL CAMPAINGS
    --------------------------------------------- */
    const pendingCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => camp?.pending);
    }, [allCampaigns]);

    /* --------------------------------------------- 
          TABLE COLUMNS
    --------------------------------------------- */
    const columns = [
        {
            name: 'Campaign',
            minWidth: '300px',
            selector: (row) => row?.title,
            cell: (row) => (
                <div row={row}>
                    <Link to={`/campaigns/${row?.title}`} className='text-reset'>
                        <div className='d-flex align-items-center'>
                            <div
                                className='flex-shrink-0 bg-cover bg-center'
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundImage: `url(${row?.cover})`,
                                    borderRadius: '0.5rem',
                                }}
                            ></div>
                            <div className='ms-3'>
                                <h6 className='mb-1' style={{ fontSize: '0.9rem' }}>
                                    {row?.title}
                                </h6>
                                <p className='text-muted small mb-0'>{truncateStart(row?.description, 30, '...')}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ),
        },
        {
            name: 'Goal',
            minWidth: '150px',
            selector: (row) => row?.goal,
            cell: (row) => (
                <div row={row}>
                    <span className='text-primary'>{row?.goal}</span> <span className='text-xs'>USD</span>
                </div>
            ),
        },
        {
            name: 'Start Date',
            minWidth: '250px',
            selector: (row) => row?.startAt,
            cell: (row) => <div row={row}>{formatDate(row?.startAt)}</div>,
        },
        {
            name: 'End Date',
            minWidth: '250px',
            selector: (row) => row?.endAt,
            cell: (row) => <div row={row}>{formatDate(row?.endAt)}</div>,
        },
    ];

    return (
        <div className='card shadow-lg mb-0' data-aos='fade-up' data-aos-delay='200'>
            <div className='card-body p-lg-5'>
                <div className='d-flex mb-5'>
                    <div className='stats-icon solid-green'>
                        <FaUncharted size='1.4rem' />
                    </div>
                    <div className='ms-3'>
                        <h2 className='mb-0 h4'>All Pending Campagins</h2>
                        <p className='text-muted fw-normal mb-0'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>
                </div>

                {pendingCampaigns && pendingCampaigns?.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={pendingCampaigns}
                        pagination={pendingCampaigns.length >= 1 && true}
                        responsive
                        theme='solarized'
                    />
                ) : (
                    <p className='mb-0'>There're no records to display</p>
                )}
            </div>
        </div>
    );
}

export default PendingCampaigns;
