import React, { useEffect, useMemo, useState } from 'react';
import { HiUsers } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import loadInvolvedCampaigns from '../../lib/loadInvolvedCampaigns';
import { formatDate, truncateStart } from '../../helpers/utils';

// HOOKS
import useCampaign from '../../hooks/useCampaign';
import useWeb3 from '../../hooks/useWeb3';
import useApp from '../../hooks/useApp';

function InvolvedCampaigns() {
    const { account } = useWeb3();
    const { allCampaigns } = useCampaign();
    const { contract, abi } = useApp();
    const [involvedIds, setInvolvedIds] = useState([]);

    /* ------------------------------------------------------- 
          GET THE CAMPAIGNS IDs THAT USER HAS PARTICIPATE IN
    ------------------------------------------------------- */
    const involvedCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => involvedIds?.includes(camp?.id));
    }, [allCampaigns, involvedIds]);

    /* ------------------------------------------------------- 
          GET THE CAMPAIGNS INFOS THAT USER HAS PARTICIPATE IN
    ------------------------------------------------------- */
    useEffect(() => {
        async function getInvlovedCampaignIds() {
            try {
                const invlovedIds = await loadInvolvedCampaigns(contract, abi, account);
                setInvolvedIds([...new Set(invlovedIds?.map((id) => Number(id)))]);
            } catch (err) {
                console.log(err);
            }
        }

        getInvlovedCampaignIds();
    }, [account, contract, abi, allCampaigns]);

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
            name: 'Campaign Status',
            minWidth: '250px',
            selector: (row) => row?.id,
            cell: (row) => (
                <div row={row}>
                    {!row?.ended ? (
                        <button className='btn btn-opac-primary btn-sm pointer-none'>Active</button>
                    ) : row?.ended && row?.pledged >= row?.goal ? (
                        <button className='btn btn-opac-primary btn-sm pointer-none'>Successful</button>
                    ) : (
                        row?.ended &&
                        row?.pledged < row?.goal && (
                            <button className='btn btn-opac-danger btn-sm pointer-none'>Failed</button>
                        )
                    )}
                </div>
            ),
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
                        <HiUsers size='1.4rem' />
                    </div>
                    <div className='ms-3'>
                        <h2 className='mb-0 h4'>Campagins I Donate In</h2>
                        <p className='text-muted fw-normal mb-0'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>
                </div>

                {involvedCampaigns && involvedCampaigns?.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={involvedCampaigns}
                        pagination={involvedCampaigns.length >= 1 && true}
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

export default InvolvedCampaigns;
