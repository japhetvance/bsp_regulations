"use client";

import { useMemo, useState } from "react";
import { Mail } from "lucide-react";

import { EmailModal } from "@/components/email-modal";

interface Report {
  Category: string;
  "Form No.": string;
  "MOR Ref.": string;
  "Report Title": string;
  Frequency: string;
  "Submission Deadline": string;
  "Submission Procedure / E-mail Address": string;
}

interface ReportCardProps {
  report: Report;
}

function extractEmailAddress(input: string) {
  const match = input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

export default function ReportCard({ report }: ReportCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const submissionInfo = report["Submission Procedure / E-mail Address"];

  const extractedEmail = useMemo(() => {
    if (!submissionInfo) {
      return "";
    }

    return extractEmailAddress(submissionInfo);
  }, [submissionInfo]);

  const handleOpenModal = () => {
    setEmailSent(false);
    setEmailTo(extractedEmail);
    setEmailSubject(report["Report Title"] ?? "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSendEmail = () => {
    setIsModalOpen(false);
    setEmailMessage("");
    setEmailSent(true);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'quarterly':
        return 'bg-blue-100 text-blue-800';
      case 'monthly':
        return 'bg-green-100 text-green-800';
      case 'annually':
        return 'bg-purple-100 text-purple-800';
      case 'weekly':
        return 'bg-yellow-100 text-yellow-800';
      case 'semestral':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {report['Report Title']}
          </h3>
          {report['Form No.'] && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Form:</span> {report['Form No.']}
            </p>
          )}
          {report['MOR Ref.'] && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">MOR Ref:</span> {report['MOR Ref.']}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {report.Category && (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 w-20">Category:</span>
            <span className="text-sm text-gray-600">{report.Category}</span>
          </div>
        )}
        
        {report.Frequency && (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 w-20">Frequency:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyColor(report.Frequency)}`}>
              {report.Frequency}
            </span>
          </div>
        )}

        {report['Submission Deadline'] && (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 w-20">Deadline:</span>
            <span className="text-sm text-gray-600">{report['Submission Deadline']}</span>
          </div>
        )}
      </div>

      {report['Submission Procedure / E-mail Address'] && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Submission:</span> {report['Submission Procedure / E-mail Address']}
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-blue-500 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2"
              aria-label="Send email"
            >
              <Mail className="h-4 w-4" />
            </button>
          </div>
          {emailSent && (
            <p className="mt-2 text-sm font-medium text-green-600">Email sent</p>
          )}
        </div>
      )}
      <EmailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSend={handleSendEmail}
        to={emailTo}
        onToChange={setEmailTo}
        subject={emailSubject}
        onSubjectChange={setEmailSubject}
        message={emailMessage}
        onMessageChange={setEmailMessage}
      />
    </div>
  );
}
