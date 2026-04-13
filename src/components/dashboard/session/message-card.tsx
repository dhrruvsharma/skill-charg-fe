"use client";

import { MessageResponse } from "@/src/schema/session/index.type";
import { clsx } from "clsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import ReactMarkdown from "react-markdown";

interface Props {
    message: MessageResponse;
}

const VIDEO_PREFIX = "__video__:";

const MessageCard = ({ message }: Props) => {
    const isUser = message.role === "user";
    const isVideo = message.content.startsWith(VIDEO_PREFIX);
    const videoUrl = isVideo ? message.content.slice(VIDEO_PREFIX.length) : null;

    return (
        <div className={clsx(
            "w-full flex my-4",
            {
                "justify-start": !isUser,
                "justify-end": isUser
            }
        )}>
            <Card className="bg-muted max-w-[70%]">
                <CardHeader>
                    <CardTitle>
                        {isUser ? "You" : "Skill Charge"}
                    </CardTitle>
                    <CardDescription className="sr-only">
                        {isUser ? "You" : "Skill Charge"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {videoUrl ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-muted-foreground">Session recording</p>
                            <video
                                src={videoUrl}
                                controls
                                className="rounded-lg w-full max-w-sm"
                                style={{ transform: "scaleX(-1)" }}
                            />
                        </div>
                    ) : (
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="text-sm">{children}</li>,
                                h1: ({ children }) => <h1 className="text-lg font-bold mb-1">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-bold mb-1">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                                code: ({ children }) => (
                                    <code className="bg-background rounded px-1 py-0.5 text-xs font-mono">
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="bg-background rounded p-3 text-xs font-mono overflow-x-auto mb-2">
                                        {children}
                                    </pre>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-2 border-muted-foreground pl-3 italic mb-2">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MessageCard;