import React from 'react'
import { useState, useEffect } from 'react'

export default function DailyReportForm() {

    const [username, setUsername] = useState('')
    const [tasks, setTasks] = useState([''])
    const [isHoliday, setIsHoliday] = useState(false)
    
    return (
        <div>
            <h1>日報フォーム</h1>
        </div>
    )
}