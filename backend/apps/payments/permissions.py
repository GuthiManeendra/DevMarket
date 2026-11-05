def has_order_access(order, request) -> bool:
    """
    Verify that the requesting client is authorized to access the given DevMarket Order.
    - If the order was placed by an authenticated user, the request must be authenticated as that user.
    - If the order was placed as a guest, the request must provide the matching X-Guest-Token header or payload guest_token.
    """
    if order.user_id:
        if request.user and request.user.is_authenticated:
            return order.user_id == request.user.id
        return False

    if order.guest_token:
        provided_token = (
            request.headers.get('X-Guest-Token', '').strip()
            or (request.data.get('guest_token', '').strip() if hasattr(request, 'data') and isinstance(request.data, dict) else '')
            or request.query_params.get('guest_token', '').strip()
        )
        return bool(provided_token and provided_token == order.guest_token)

    return True

