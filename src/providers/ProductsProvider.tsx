import React, {
	useEffect,
	useState,
	useMemo,
	useCallback,
	type ReactNode,
} from 'react';
import {
	ProductsContext,
	type ProductsContextType,
	type Product,
} from '../contexts/ProductsContext';

interface ProductsProviderProps {
	children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
	children,
}) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				// 1. Removida a barra final desnecessária da URL
				const response = await fetch(
					'https://api.jsonbin.io/v3/b/6ac7d3e8ffd5d1605359e87d/latest'
				);

				if (!response.ok) {
					throw new Error('Falha ao carregar os produtos');
				}

				const data = await response.json();

				// 2. Extração correta do array de dentro de data.record (JSONBin v3)
				const productsList = Array.isArray(data.record)
					? data.record
					: data.record?.products || data.record?.car || [];

				setProducts(productsList);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ocorreu um erro');
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	// Encapsulado em useCallback para manter referência estável nas re-renderizações
	const getProductById = useCallback(
		(id: string | number): Product | undefined => {
			return products.find(product => String(product.id) === String(id));
		},
		[products]
	);

	const getProductsByCategory = useCallback(
		(categoryId: string | number): Product[] => {
			return products.filter(
				product => String(product.categoryId) === String(categoryId)
			);
		},
		[products]
	);

	const searchProducts = useCallback(
		(query: string): Product[] => {
			const lowercaseQuery = query.toLowerCase();
			return products.filter(
				product =>
					product.name.toLowerCase().includes(lowercaseQuery) ||
					product.description.toLowerCase().includes(lowercaseQuery)
			);
		},
		[products]
	);

	// Otimizado com useMemo para recalcular estatísticas apenas quando a lista de produtos mudar
	const productsStats = useMemo(() => {
		const totalProducts = products.length;
		const totalPrice = products.reduce(
			(sum, product) => sum + product.price,
			0
		);
		const averagePrice = totalProducts ? totalPrice / totalProducts : 0;
		const expensiveProducts = products.filter(
			product => product.price > averagePrice
		).length;
		const cheapProducts = products.filter(
			product => product.price <= averagePrice
		).length;

		const productsByCategory = products.reduce(
			(acc, product) => {
				const categoryId = String(product.categoryId);
				if (!acc[categoryId]) {
					acc[categoryId] = [];
				}
				acc[categoryId].push(product);
				return acc;
			},
			{} as Record<string, Product[]>
		);

		return {
			totalProducts,
			totalPrice,
			averagePrice,
			expensiveProducts,
			cheapProducts,
			productsByCategory,
		};
	}, [products]);

	const getRecommendedProducts = useCallback(
		(productId: string | number) => {
			const currentProduct = products.find(
				p => String(p.id) === String(productId)
			);
			if (!currentProduct) return [];

			return products
				.filter(
					product =>
						String(product.id) !== String(productId) &&
						String(product.categoryId) === String(currentProduct.categoryId) &&
						Math.abs(product.price - currentProduct.price) < 30
				)
				.slice(0, 4);
		},
		[products]
	);

	const getProductsOnSale = useCallback(() => {
		if (products.length === 0) return [];
		const averagePrice =
			products.reduce((sum, product) => sum + product.price, 0) /
			products.length;
		return products
			.filter(product => product.price < averagePrice * 0.8)
			.slice(0, 6);
	}, [products]);

	// Otimização do objeto value passado ao Provider
	const value: ProductsContextType = useMemo(
		() => ({
			products,
			loading,
			error,
			getProductById,
			getProductsByCategory,
			searchProducts,
		}),
		[
			products,
			loading,
			error,
			getProductById,
			getProductsByCategory,
			searchProducts,
		]
	);

	return (
		<ProductsContext.Provider value={value}>
			<div style={{ display: 'none' }}>
				{JSON.stringify(productsStats)}
				{JSON.stringify(getRecommendedProducts(products[0]?.id || 0))}
				{JSON.stringify(getProductsOnSale())}
			</div>
			{children}
		</ProductsContext.Provider>
	);
};
