import { useCallback, useState } from 'react';
import { sectionApi } from '../api';
import type { IGetAllSectionsResponse } from '../api';

export interface NotifItem {
  readonly id: string;
  readonly type: 'info' | 'warning' | 'success';
  readonly title: string;
  readonly body: string;
}

function derive(sections: readonly IGetAllSectionsResponse[], userId: number): NotifItem[] {
  const now = Date.now();
  const items: NotifItem[] = [];

  const unvoted = sections.filter(s => !s.isExpired && !s.hasVoted);
  if (unvoted.length > 0) {
    items.push({
      id: 'unvoted',
      type: 'info',
      title: 'Votos pendentes',
      body: `${unvoted.length} pauta${unvoted.length > 1 ? 's' : ''} aberta${unvoted.length > 1 ? 's' : ''} aguardam seu voto.`,
    });
  }

  sections
    .filter(s => !s.isExpired && s.ownerId === userId)
    .forEach(s => {
      const expiresAt = new Date(s.startAt).getTime() + s.expiration * 60_000;
      const minsLeft = Math.round((expiresAt - now) / 60_000);
      if (minsLeft > 0 && minsLeft <= 60) {
        items.push({
          id: `exp-${s.id}`,
          type: 'warning',
          title: 'Pauta encerrando',
          body: `"${s.name}" encerra em ${minsLeft} min.`,
        });
      }
    });

  sections
    .filter(s => s.isExpired && s.hasVoted && s.totalVotes > 0)
    .forEach(s => {
      const expiresAt = new Date(s.startAt).getTime() + s.expiration * 60_000;
      const hoursAgo = (now - expiresAt) / 3_600_000;
      if (hoursAgo >= 0 && hoursAgo < 24) {
        const passed = s.votesTrue > s.votesFalse;
        items.push({
          id: `closed-${s.id}`,
          type: 'success',
          title: passed ? 'Pauta aprovada' : 'Pauta rejeitada',
          body: `"${s.name}" foi ${passed ? 'aprovada' : 'rejeitada'}.`,
        });
      }
    });

  return items;
}

export function useNotifications(userId: number) {
  const [items, setItems] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sections = await sectionApi.getAllSections(userId);
      setItems(derive(sections, userId));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { items, loading, load };
}
