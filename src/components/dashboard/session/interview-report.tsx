"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { InterviewReport } from "@/src/schema/session/index.type";
import { AlertTriangle, Award, ChevronDown, ChevronUp, Shield, Target, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";

interface InterviewReportCardProps {
    report: InterviewReport;
    onDismiss?: () => void;
}

function ScoreBadge({ score }: { score: number }) {
    const color =
        score >= 8 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
        score >= 6 ? "text-blue-400 border-blue-500/30 bg-blue-500/10" :
        score >= 4 ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                     "text-red-400 border-red-500/30 bg-red-500/10";

    return (
        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-lg ${color}`}>
            {score}
        </span>
    );
}

export default function InterviewReportCard({ report, onDismiss }: InterviewReportCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="w-full flex justify-center my-6">
            <Card className="w-full max-w-2xl border-primary/20 shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Interview Report</CardTitle>
                        </div>
                        <div className="flex items-center gap-3">
                            <ScoreBadge score={report.overall_score} />
                            {onDismiss && (
                                <Button variant="ghost" size="icon" onClick={onDismiss} className="h-7 w-7">
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <CardDescription className="mt-2">{report.summary}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Strengths */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                            <TrendingUp className="w-4 h-4" />
                            Strengths
                        </div>
                        <ul className="space-y-1 pl-6">
                            {report.strengths.map((s, i) => (
                                <li key={i} className="text-sm text-muted-foreground list-disc">{s}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-500">
                            <Target className="w-4 h-4" />
                            Areas for Improvement
                        </div>
                        <ul className="space-y-1 pl-6">
                            {report.weaknesses.map((w, i) => (
                                <li key={i} className="text-sm text-muted-foreground list-disc">{w}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Proctoring */}
                    {report.proctoring && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Shield className="w-4 h-4" />
                                Proctoring
                            </div>
                            <div className="rounded-lg border p-3 space-y-1.5 text-sm">
                                {report.proctoring.multiple_faces_detected && (
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Multiple faces detected during the session
                                    </div>
                                )}
                                {report.proctoring.tab_switch_count > 0 && (
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        {report.proctoring.tab_switch_count} tab switch{report.proctoring.tab_switch_count > 1 ? "es" : ""} detected
                                    </div>
                                )}
                                {report.proctoring.suspicious_audio && (
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Suspicious audio detected
                                    </div>
                                )}
                                {!report.proctoring.multiple_faces_detected &&
                                 report.proctoring.tab_switch_count === 0 &&
                                 !report.proctoring.suspicious_audio && (
                                    <div className="text-emerald-500 text-sm">No integrity issues detected</div>
                                )}
                                <p className="text-muted-foreground text-xs mt-1">{report.proctoring.integrity_note}</p>
                            </div>
                        </div>
                    )}

                    {/* Expandable detailed feedback */}
                    <div>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
                        >
                            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            {expanded ? "Hide" : "Show"} detailed feedback
                        </button>
                        {expanded && (
                            <div className="mt-3 space-y-4">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {report.detailed_feedback}
                                </p>

                                {/* Per-question scores */}
                                {report.question_scores && report.question_scores.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Question Breakdown</p>
                                        <div className="space-y-2">
                                            {report.question_scores.map((q, i) => (
                                                <div key={i} className="flex items-start gap-3 rounded border p-2.5">
                                                    <ScoreBadge score={q.score} />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate">{q.question}</p>
                                                        <p className="text-xs text-muted-foreground">{q.feedback}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
