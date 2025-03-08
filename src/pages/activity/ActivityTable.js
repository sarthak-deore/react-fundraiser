import React, { useMemo } from 'react';
import { HiPresentationChartBar } from 'react-icons/hi';
import { formatDate, toBlockExplorer, truncate } from '../../helpers/utils';
import DataTable from 'react-data-table-component';

// HOOKS
import useUser from '../../hooks/useUser';

function ActivityTable() {
    const { activity, usersList } = useUser();

    // FORMATE THE ACTIVITY USERS [LABEL THEM IF NOT REGISTERED]
    const formattedactivity = useMemo(() => {
        return activity
            ?.map((item) => ({
                ...item,
                userAddress: item?.user,
                user: usersList?.filter((user) => item?.user === user?.address)[0],
            }))
            ?.map((item) => {
                if (!item?.user) {
                    return {
                        ...item,
                        user: {
                            name: 'Anonymous User',
                            address: item?.userAddress,
                        },
                    };
                } else {
                    return {
                        ...item,
                    };
                }
            });
    }, [activity, usersList]);

    console.log(formattedactivity);

    /* --------------------------------------------- 
          TABLE COLUMNS
    --------------------------------------------- */
    const columns = [
        {
            name: 'User',
            minWidth: '300px',
            selector: (row) => row?.user,
            cell: (row) => (
                <div row={row}>
                    <a
                        href={`${toBlockExplorer('address', row?.user?.address)}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-reset d-block'
                    >
                        <div className='d-flex align-items-center'>
                            <div
                                className='flex-shrink-0 bg-cover bg-center'
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundImage: `url(${row?.user?.profile || '/profile.png'})`,
                                    borderRadius: '0.5rem',
                                }}
                            ></div>
                            <div className='ms-3'>
                                <h6 className='mb-1' style={{ fontSize: '0.9rem' }}>
                                    {row?.user?.name}
                                </h6>
                                {row?.user?.email ? (
                                    <p className='text-muted small mb-0'>{row?.user?.email}</p>
                                ) : (
                                    <p className='text-muted small mb-0'>{truncate(row?.userAddress, 20, '...')}</p>
                                )}
                            </div>
                        </div>
                    </a>
                </div>
            ),
        },
        {
            name: 'Time',
            minWidth: '200px',
            selector: (row) => row?.time,
            cell: (row) => (
                <div row={row}>
                    <small>{formatDate(row.time)}</small>
                </div>
            ),
        },
        {
            name: 'Action',
            selector: (row) => row?.status,
            cell: (row) => (
                <div row={row}>
                    <span className='small'>{row?.status}</span>
                </div>
            ),
        },
    ];

    return (
        <div className='card shadow-lg mb-0' data-aos='fade-up' data-aos-delay='200'>
            <div className='card-body p-lg-5'>
                <div className='d-flex a;ign-items-center mb-5'>
                    <div className='stats-icon solid-cyan'>
                        <HiPresentationChartBar size='1.4rem' />
                    </div>
                    <div className='ms-3'>
                        <h2 className='mb-0 h4'>Activity Table</h2>
                        <p className='text-muted fw-normal mb-0'></p>
                    </div>
                </div>

                {formattedactivity && formattedactivity.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={formattedactivity}
                        pagination={formattedactivity.length >= 1 && true}
                        responsive
                        theme='solarized'
                    />
                ) : (
                    <p className='mb-0'>There're no records to display </p>
                )}
            </div>
        </div>
    );
}

export default ActivityTable;
