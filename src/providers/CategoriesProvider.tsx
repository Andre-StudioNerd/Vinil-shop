import React, { useEffect, useState, type ReactNode } from 'react';
import {
	CategoriesContext,
	type CategoriesContextType,
	type Category,
} from '../contexts/CategoriesContext';

interface CategoriesProviderProps {
	children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
	children,
}) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					'https://api.jsonbin.io/v3/b/6ac7d3e8ffd5d1605359e87d/latest'
				);

				if (!response.ok) {
					throw new Error('Falha ao carregar as categorias');
				}

				const data = await response.json();

				// Extrai o array de categorias de dentro do objeto 'record' do JSONBin
				const categoriesList = Array.isArray(data.record)
					? data.record
					: data.record?.category || data.record?.categories || [];

				setCategories(categoriesList);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ocorreu um erro');
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const getCategoryById = (id: number | string): Category | undefined => {
		return categories.find(category => String(category.id) === String(id));
	};

	const value: CategoriesContextType = {
		categories,
		loading,
		error,
		getCategoryById,
	};

	return (
		<CategoriesContext.Provider value={value}>
			{children}
		</CategoriesContext.Provider>
	);
};
