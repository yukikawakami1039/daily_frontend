import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DailyReportForm() {
    const navigate = useNavigate();

    // ステート管理
    const [username, setUsername] = useState('');
    const [tasks, setTasks] = useState([{ id: 1, content: '' }]);
    const [isHoliday, setIsHoliday] = useState(false);
    const [error, setError] = useState('');

    // ユーザー名をAPIから取得
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch('/api/user');
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else {
                    setTimeout(() => navigate('/'), 0);
                }
            } catch (error) {
                console.error('ユーザー名の取得に失敗しました:', error);
                setTimeout(() => navigate('/'), 0);
            }
        };

        fetchUsername();
    }, [navigate]);

    // タスク追加関数
    const addTask = () => {
        setTasks([...tasks, { id: Date.now(), content: '' }]);
    };

    // タスク入力変更ハンドラ
    const handleTaskChange = (id, value) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, content: value } : task
            )
        );
    };

    // フォーム送信処理
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const formData = new FormData(event.currentTarget);
        const date = formData.get('date');

        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    date,
                    isHoliday,
                    tasks: tasks.map((task) => task.content),
                    report: formData.get('report'),
                    tomorrow: formData.get('tomorrow'),
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('日報が正常に送信されました。');
            } else {
                throw new Error('日報の送信に失敗しました。');
            }
        } catch (error) {
            console.error('日報送信エラー:', error);
            setError('日報の送信に失敗しました。再度お試しください。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* 氏名 */}
            <div>
                <label htmlFor="name">
                    氏名
                </label>
                <input
                    id="name"
                    name="name"
                    value={username}
                    disabled
                />
            </div>

            {/* 日付 */}
            <div>
                <label htmlFor="date">
                    日付
                </label>
                <input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                />
            </div>

            {/* 勤務日 or 休日 */}
            <fieldset>
                <legend>勤務日 or 休日</legend>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="dayType"
                            value="workday"
                            defaultChecked
                            onChange={() => setIsHoliday(false)}
                            className="form-radio"
                        />
                        勤務日
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="dayType"
                            value="holiday"
                            onChange={() => setIsHoliday(true)}
                            className="form-radio"
                        />
                        休日
                    </label>
                </div>
            </fieldset>

            {/* タスク入力（勤務日のみ表示） */}
            {!isHoliday && (
                <>
                    <div>
                        <label>やったこと</label>
                        {tasks.map((task, index) => (
                            <input
                                key={task.id}
                                name={`task${index + 1}`}
                                value={task.content}
                                placeholder={`タスク ${index + 1}`}
                                onChange={(e) => handleTaskChange(task.id, e.target.value)}
                                required={index === 0}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addTask}
                        >
                            + やったことを追加
                        </button>
                    </div>
                </>
            )}

            {/* 報告事項 */}
            <div>
                <label htmlFor="report">報告事項</label>
                <textarea
                    id="report"
                    name="report"
                    placeholder="特筆すべき報告事項があれば記入してください。"
                    required
                />
            </div>

            {/* 保存ボタン */}
            <button type="submit">
                保存する
            </button>

            {/* エラーメッセージ */}
            {error && <p>{error}</p>}
        </form>
    );
}