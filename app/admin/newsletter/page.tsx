"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Newsletter } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Mail, Plus } from "lucide-react";
import NewsletterTable from "@/app/admin/newsletter/_components/NewsletterTable";
import AddSubscriberDialog from "@/app/admin/newsletter/_components/AddSubscriberDialog";
import {
  getNewsletters,
  getSubscriberCount,
} from "@/app/_lib/actions/newsletter.actions";

const AdminNewsletterPage: FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<{
    count: number;
    hasMore: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNewsletters = useCallback(async () => {
    const data = await getNewsletters();
    setNewsletters(data);
  }, []);

  const fetchSubscribers = useCallback(async () => {
    const data = await getSubscriberCount();
    setSubscribers(data);
  }, []);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchNewsletters(), fetchSubscribers()]);
      setIsLoading(false);
    };
    load();
  }, [fetchNewsletters, fetchSubscribers]);

  return (
    <div className="wrapper max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl uppercase text-foreground">
            Newsletter
          </h1>
          {subscribers && (
            <Badge className="bg-primary/10 text-primary text-sm px-3 py-1">
              {subscribers.hasMore
                ? `${subscribers.count}+`
                : subscribers.count}{" "}
              {subscribers.count === 1 ? "Subscriber" : "Subscribers"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <AddSubscriberDialog onAdded={fetchSubscribers} />
          <Button className="font-medium" asChild>
            <Link href="/admin/newsletter/create">
              <Plus className="w-4 h-4" /> New Newsletter
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : newsletters.length > 0 ? (
            <NewsletterTable
              newsletters={newsletters}
              onChanged={fetchNewsletters}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
              <p>No newsletters yet. Write your first one to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsletterPage;
