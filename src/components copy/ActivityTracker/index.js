import { axios_ } from '@/utils/utll'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function ActivityTracker() {
    const router = useRouter()
    const [enterTime, setTime] = useState("")

    useEffect(() => {

        setTime(new Date(Date.now()).toISOString())
        return () => {
            let exitTime = new Date(Date.now()).toISOString()
            logActivity(enterTime, exitTime)
        }
    }, [router.asPath])

    async function logActivity(enterTime = "", exitTime = "") {
        if (!enterTime || !exitTime) return
        try {
            let [_, module, subModule] = router.asPath.split('/')
            let data = { pageUrl: router.asPath, portal: 'Advisor Portal', module, subModule: subModule || "", enterTime, exitTime }
            await axios_.post(`urls-activity/save`, data)
        } catch (e) {
            console.log('Actity Log Error', e);
        }
    }
    return (
        <></>
    )
}
export default ActivityTracker
