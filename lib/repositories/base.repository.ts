/**
 * Abstract repository with common CRUD signatures
 */
export abstract class BaseRepository<T> {
  /**
   * Find all entities matching filter criteria
   */
  abstract findAll(filter?: unknown): Promise<{ items: T[]; total?: number }>;

  /**
   * Find one entity by ID
   */
  abstract findById(id: string): Promise<T | null>;

  /**
   * Create a new entity
   */
  abstract create(data: Partial<T>): Promise<T>;

  /**
   * Update an existing entity
   */
  abstract update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete an entity by ID
   */
  abstract delete(id: string): Promise<void>;
}
