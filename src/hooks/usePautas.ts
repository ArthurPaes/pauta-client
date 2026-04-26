import { useCallback, useEffect, useState } from 'react';
import { sectionApi } from '../api';
import type { IGetAllSectionsResponse } from '../api';
import type { PautaModel } from '../components/PautaCard';

interface UsePautasResult {
  pautas: PautaModel[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function buildModel(sections: IGetAllSectionsResponse[]): PautaModel[] {
  return sections.map<PautaModel>(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    expiration: s.expiration,
    hasVoted: s.hasVoted,
    totalVotes: s.totalVotes,
    votesTrue: s.votesTrue,
    votesFalse: s.votesFalse,
    isExpired: s.isExpired,
    ownerId: s.ownerId ?? undefined,
    allowedUsers: s.allowedUsers,
  }));
}

export function usePautas(userId: number): UsePautasResult {
  const [pautas, setPautas] = useState<PautaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sections = await sectionApi.getAllSections(userId);
      setPautas(buildModel(sections));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar pautas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { pautas, loading, error, refresh };
}
