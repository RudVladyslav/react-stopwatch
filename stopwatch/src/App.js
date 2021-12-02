import './App.css';
import React, {useCallback, useEffect} from "react";
import {useState} from "react";
import {interval, Subject, takeUntil} from "rxjs";

const timeFormat = require('hh-mm-ss')

const App = () => {
    const [sec, setSec] = useState(0)
    const [status, setStatus] = useState("stop")
    const [buttonVisible, setButtonVisible] = useState("start")

    window.status = status

    useEffect(() => {
        console.log(status)
        const unsubscribe$ = new Subject()
        interval(1000)
            .pipe(takeUntil(unsubscribe$))
            .subscribe(() => {
                if (status === "run") {
                    setSec(v => v + 1)
                }
            })
        return () => {
            unsubscribe$.next()
            unsubscribe$.complete()
        };
    }, [status]);

    const start = useCallback(() => {
        setStatus("run")
    }, [])

    const stop = useCallback(() => {
        setStatus("stop")
        setSec(0)
    }, [])

    const reset = useCallback(() => {
        if (status === "wait") {
            start()
            setButtonVisible('stop')
        }
        setSec(0);
    }, [status])

    const wait = useCallback(() => {
        setStatus("wait")
    }, [])

    const timeFormatRender = (sec) => timeFormat.fromS(sec, 'hh:mm:ss')

    return (
        <div className="App">
            <div className="app-inner-wrapper">
                <div className="timer">
                    {timeFormatRender(sec)}
                </div>
                <div className="button-wrapper">
                    {buttonVisible === 'start'
                        ? <button className='start' onClick={() => {
                            setButtonVisible('stop')
                            start()
                        }}>START</button>
                        : <button className='stop' onClick={() => {
                            setButtonVisible('start')
                            stop()
                        }}>
                            STOP
                        </button>}
                    <button className='reset' onClick={reset}>RESET</button>
                    <button className='wait' onDoubleClick={() => {
                        setButtonVisible('start')
                        wait()
                    }
                    }>WAIT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;