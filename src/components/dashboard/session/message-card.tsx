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
            "w-full flex",
            {
                "justify-start": !isUser,
                "justify-end": isUser
            }
        )}>
            <Card className="bg-muted max-w-[70%]">
                <CardHeader>
                    <CardTitle>
                        {message.role === "user" && (
                            "You"
                        )}
                        {message.role === "assistant" && (
                            "Skill Charge"
                        )}
                    </CardTitle>
                    <CardDescription className="sr-only">
                        {message.role === "user" && (
                            "You"
                        )}
                        {message.role === "assistant" && (
                            "Skill Charge"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-wrap">
                    {message.content}
                </CardContent>
            </Card>
        </div>
    )
}

export default MessageCard;