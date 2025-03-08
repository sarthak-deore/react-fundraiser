import React from 'react';
import { HiUsers } from 'react-icons/hi';
import { truncateStart, toBlockExplorer } from '../../helpers/utils';
import DataTable from 'react-data-table-component';

// HOOKS
import useUser from '../../hooks/useUser';

function AllUsersTable() {
    const { usersList } = useUser();

    /* --------------------------------------------- 
          TABLE COLUMNS
    --------------------------------------------- */
    const columns = [
        {
            name: 'User',
            minWidth: '300px',
            selector: (row) => row?.index,
            cell: (row) => (
                <div row={row}>
                    <a
                        href={`${toBlockExplorer('address', row?.address)}`}
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
                                    backgroundImage: `url(${row?.profile})`,
                                    borderRadius: '0.5rem',
                                }}
                            ></div>
                            <div className='ms-3'>
                                <h6 className='mb-1' style={{ fontSize: '0.9rem' }}>
                                    {row?.name}
                                </h6>
                                <p className='text-muted small mb-0'>{truncateStart(row?.email, 30, '...')}</p>
                            </div>
                        </div>
                    </a>
                </div>
            ),
        },
        {
            name: 'Location',
            minWidth: '150px',
            selector: (row) => row?.location,
            cell: (row) => <div row={row}>{row?.location}</div>,
        },
        {
            name: 'Wallet Address',
            minWidth: '400px',
            selector: (row) => row?.address,
            cell: (row) => <div row={row}>{row?.address}</div>,
        },
        {
            name: 'Phone Number',
            minWidth: '250px',
            selector: (row) => row?.phone,
            cell: (row) => <div row={row}>{row?.phone}</div>,
        },
        {
            name: 'Verified',
            minWidth: '100px',
            selector: (row) => row?.verified,
            cell: (row) => <div row={row}>{row?.verified ? 'Yes' : 'No'}</div>,
        },
    ];

    return (
        <div className='card shadow-lg mb-0' data-aos='fade-up' data-aos-delay='200'>
            <div className='card-body p-lg-5'>
                <div className='d-flex mb-5'>
                    <div className='stats-icon solid-green'>
                        <HiUsers size='1.4rem' />
                    </div>
                    <div className='ms-3'>
                        <h2 className='mb-0 h4'>All Users</h2>
                        <p className='text-muted fw-normal mb-0'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>
                </div>

                {usersList?.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={usersList}
                        pagination={usersList.length >= 1 && true}
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

export default AllUsersTable;
