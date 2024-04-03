import { Typography } from '@mui/material';
import { useState, useEffect } from 'react'

function TranscriptPreview({ interviewer, interviewee, transcript, onPreviewGenerated }) {

    const [previewData, setPreviewData] = useState('');

    useEffect(() => {
        const cleaning = (text) => {
            //tabs are replaced by single space
            text = text.replace(/\s{4}/g, "");
            //multiple spaces are replaced by single space
            text = text.replace(/\s\s+/g, "");
            //multiple fullstops are replaced by a single fullstop
            text = text.replace(/\.+/g, ".");
            //?. is replaced by ?
            text = text.replace(/\?\./g, "?");
            //. . is replaced by .
            text = text.replace(/\. \./g, ". ");
            return text;
        };

        let data = {};
        if (transcript !== "") {
            let lines = cleaning(transcript).split(/\s*(?<=[.!?;])\s*|\n+/g);
            const check1 = new RegExp(`^.+:`);
            let isQuestion = false;
            let sentence_num = 1;
            let question_num = 1;
            let answer_num = 1;
            let incorrectData = false;

            function splitFirstOccurrence(str, separator) {
                const index = str.indexOf(separator);
                if (index === -1) return [str, '']; // Ensure function always returns two elements
                return [str.slice(0, index).trim(), str.slice(index + separator.length).trim()];
            }

            // check if correct interview and interviewee labels 
            lines.forEach(line => {
                if (!(line.match(check1) && line.trim().startsWith(interviewer + ":")) && !(line.match(check1) && line.trim().startsWith(interviewee + ":")) && !(!line.match(check1))) {
                    onPreviewGenerated({ error: "Include the correct interviewer and interviewee labels." });
                    setPreviewData({})
                    incorrectData = true
                }
            })

            if (!incorrectData) {
                lines.forEach(line => {
                    if (line.match(check1) && line.trim().startsWith(interviewer + ":")) {
                        // Handle question
                        isQuestion = true;
                        question_num++;
                        data[sentence_num] = {
                            sentence_num: sentence_num,
                            question_id: question_num,
                            questioner_tag: interviewer,
                            question_text: splitFirstOccurrence(line, ":")[1],
                        };
                        sentence_num++;
                        answer_num = 1;
                    } else if (line.match(check1) && line.trim().startsWith(interviewee + ":")) {
                        // Handle answer
                        isQuestion = false;
                        if (!data[sentence_num] || !data[sentence_num].response_text) {
                            data[sentence_num] = {
                                sentence_num: sentence_num,
                                response_id: question_num,
                                response_tag: interviewee,
                                response_text: {},
                            };
                        }
                        data[sentence_num].response_text[answer_num] = {
                            text: splitFirstOccurrence(line, ":")[1],
                        };
                        sentence_num++;
                        answer_num++;
                    } else if (!line.match(check1)) {
                        // Handle continuation

                        if (isQuestion) {
                            data[sentence_num - 1].question_text += " " + cleaning(line);
                        } else {
                            data[sentence_num - 1].response_text[answer_num] = { text: cleaning(line) };
                            answer_num++
                        }
                    }
                });
                setPreviewData(data)
                onPreviewGenerated({ data: data });
            }
        }


    }, [interviewer, interviewee, transcript]);

    // display interviewee text
    const displayIntervieweeText = (value, name, key_ori) => {
        {
            return Object.entries(value).map(([key, value]) => {
                return (
                    <Typography id={key_ori + key} style={{ display: "inline" }}>{value.text}{" "}</Typography>
                );
            });
        }
    };


    if (Object.keys(previewData).length === 0) {
        return (
            <>
                <Typography align="center">No transcript data has been entered yet.</Typography>
            </>
        );
    } else {
        return Object.entries(previewData).map(([key, value]) => {
            if (value.questioner_tag !== undefined) {
                return (
                    <div key={key}>
                        <Typography display="inline">{value.questioner_tag}: </Typography>
                        <Typography display="inline" id={key}>
                            {value.question_text}
                        </Typography>
                        <br />
                        <br />
                    </div>
                );
            } else {
                return (
                    <>
                        <div key={key}>
                            <Typography display="inline">{value.response_tag}: </Typography>
                            {displayIntervieweeText(value.response_text, value.response_tag, key.toString())}
                        </div>
                        <div>
                            <br />
                        </div>
                    </>
                );
            }
        });
    }

}

export default TranscriptPreview;