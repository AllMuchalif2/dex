import { useState, useEffect, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchPokemonIdsByType, fetchPokemonIdsByAbility, fetchPokemonIdsByGrowthRate, fetchPokemonIdsByEggGroup, fetchPokemonIdsByMove } from '../api/filters';
import useFilterStore, { computeFilteredIds } from '../store/filterStore';

const PAGE_SIZE = 20;
const STALE = 24 * 60 * 60 * 1000;

export function useFilteredPokemon() {
  const {
    selectedVersion,
    selectedGen,
    selectedType,
    selectedAbility,
    selectedAbilitySlot,
    selectedGrowthRate,
    selectedEggGroup,
    selectedEvYield,
    selectedMove,
    selectedMoveSlot
  } = useFilterStore();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [selectedVersion, selectedGen, selectedType, selectedAbility, selectedAbilitySlot, selectedGrowthRate, selectedEggGroup, selectedEvYield, selectedMove, selectedMoveSlot]);

  // Fetch IDs berdasarkan tipe dari API (di-cache 24h)
  const typeQueries = useQueries({
    queries: selectedType
      ? [{ queryKey: ['type-filter', selectedType], queryFn: () => fetchPokemonIdsByType(selectedType), staleTime: STALE }]
      : [],
  });

  // Fetch IDs berdasarkan ability dari API (di-cache 24h)
  const abilityQueries = useQueries({
    queries: selectedAbility
      ? [{ queryKey: ['ability-filter', selectedAbility], queryFn: () => fetchPokemonIdsByAbility(selectedAbility), staleTime: STALE }]
      : [],
  });

  const growthRateQueries = useQueries({
    queries: selectedGrowthRate
      ? [{ queryKey: ['growth-rate-filter', selectedGrowthRate], queryFn: () => fetchPokemonIdsByGrowthRate(selectedGrowthRate), staleTime: STALE }]
      : [],
  });

  const eggGroupQueries = useQueries({
    queries: selectedEggGroup
      ? [{ queryKey: ['egg-group-filter', selectedEggGroup], queryFn: () => fetchPokemonIdsByEggGroup(selectedEggGroup), staleTime: STALE }]
      : [],
  });

  const moveQueries = useQueries({
    queries: selectedMove
      ? [{ queryKey: ['move-filter', selectedMove], queryFn: () => fetchPokemonIdsByMove(selectedMove), staleTime: STALE }]
      : [],
  });

  const typesLoading = selectedType != null && typeQueries.some((q) => q.isLoading);
  const abilityLoading = selectedAbility != null && abilityQueries.some((q) => q.isLoading);
  const growthRateLoading = selectedGrowthRate != null && growthRateQueries.some((q) => q.isLoading);
  const eggGroupLoading = selectedEggGroup != null && eggGroupQueries.some((q) => q.isLoading);
  const moveLoading = selectedMove != null && moveQueries.some((q) => q.isLoading);
  
  const typeIds = typeQueries[0]?.data ? new Set(typeQueries[0].data) : null;
  const abilityData = abilityQueries[0]?.data ?? null;
  const growthRateIds = growthRateQueries[0]?.data ?? null;
  const eggGroupIds = eggGroupQueries[0]?.data ?? null;
  const moveIds = moveQueries[0]?.data ?? null;

  // Hitung filtered IDs (AND logic)
  const filteredIds = useMemo(() => {
    if (typesLoading || abilityLoading || growthRateLoading || eggGroupLoading || moveLoading) return null;
    return computeFilteredIds(
      selectedVersion,
      selectedGen,
      selectedType,
      selectedAbility,
      selectedAbilitySlot,
      selectedGrowthRate,
      selectedEggGroup,
      typeIds,
      abilityData,
      growthRateIds,
      eggGroupIds,
      selectedEvYield,
      selectedMove,
      selectedMoveSlot,
      moveIds
    );
  }, [
    selectedVersion,
    selectedGen,
    selectedType,
    selectedAbility,
    selectedAbilitySlot,
    selectedGrowthRate,
    selectedEggGroup,
    selectedEvYield,
    selectedMove,
    selectedMoveSlot,
    typeIds,
    abilityData,
    growthRateIds,
    eggGroupIds,
    moveIds,
    typesLoading,
    abilityLoading,
    growthRateLoading,
    eggGroupLoading,
    moveLoading,
  ]);

  const isFiltered = !!(selectedVersion || selectedGen || selectedType || selectedAbility || selectedGrowthRate || selectedEggGroup || selectedEvYield || selectedMove);
  const pageIds = filteredIds ? filteredIds.slice(0, (page + 1) * PAGE_SIZE) : [];
  const hasMore = filteredIds ? (page + 1) * PAGE_SIZE < filteredIds.length : false;

  return {
    filteredIds,
    pageIds,
    total: filteredIds?.length ?? null,
    page,
    setPage,
    hasMore,
    isLoading: typesLoading || abilityLoading || growthRateLoading || eggGroupLoading || moveLoading,
    isFiltered,
  };
}
