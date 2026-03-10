"use client";

import {MessageResponse} from "@/src/schema/session/index.type";
import {clsx} from "clsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/src/components/ui/card";

interface Props {
    message: MessageResponse;
}

const MessageCard = ({message} :Props) => {
    const isUser = message.role === "user";
    return (
        <div className={clsx(
            "w-[70%] flex",
            {
                "items-start": !isUser,
                "items-end": isUser
            }
        )}>
            <Card className="bg-muted">
                <CardHeader>
                    <CardTitle>{message.role}</CardTitle>
                    <CardDescription className="sr-only">{message.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-wrap">
                    {message.content}
                </CardContent>
            </Card>
        </div>
    )
}

export default MessageCard;