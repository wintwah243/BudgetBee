import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../cards/TransactionInfoCard'
import moment from 'moment'

const RecentIncome = ({transactions, onSeeMore}) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Your Income</h5>

            <button className='card-btn'>
                See All <LuArrowRight className='text-base' />
            </button>
        </div>

        <div className='mt-6'>
            {transactions?.slice(0,5)?.map((item ) => (
                <TransactionInfoCard 
                    key={item._id}
                    title={item.source}
                    icon={item.icon}
                    description={item.description}
                    date={moment(item.date).format("Do MMM YYYY")}
                    amount={item.amount}
                    type="income"
                    hideDeleteBtn
                />
            ))}
        </div>
    </div>
  )
}

export default RecentIncome