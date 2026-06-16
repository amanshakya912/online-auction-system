class PaginationHelper {
  static paginate(page = 1, limit = 20) {
    const maxLimit = 100;
    const sanitizedLimit = Math.min(Math.max(1, parseInt(limit) || 20), maxLimit);
    const sanitizedPage = Math.max(1, parseInt(page) || 1);
    const skip = (sanitizedPage - 1) * sanitizedLimit;
    return { skip, limit: sanitizedLimit, page: sanitizedPage };
  }

  static async getPaginatedResponse(model, filter, page, limit, sort = {}, populate = null) {
    const { skip, limit: sanitizedLimit, page: sanitizedPage } = this.paginate(page, limit);

    let query = model.find(filter).sort(sort).skip(skip).limit(sanitizedLimit);
    if (populate) query = query.populate(populate);

    const [results, total] = await Promise.all([
      query.exec(),
      model.countDocuments(filter)
    ]);

    return {
      data: results,
      pagination: {
        total,
        page: sanitizedPage,
        limit: sanitizedLimit,
        totalPages: Math.ceil(total / sanitizedLimit),
        hasNextPage: sanitizedPage * sanitizedLimit < total,
        hasPrevPage: sanitizedPage > 1
      }
    };
  }
}

module.exports = PaginationHelper;
