import logging

from .api_base import BaseNamespace
from .controller import EcgController


def create_namespace(server_config):
    logger = logging.getLogger("server." + __name__)
    logger.info("Creating namespace")
    namespace = EcgNamespace("/api")
    controller = EcgController(**server_config)
    namespace.controller = controller
    logger.info("Namespace created")
    return namespace


class EcgNamespace(BaseNamespace):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def on_ECG_GET_LIST(self, data, meta):
        self._safe_call(self.controller.get_list, data, meta, "ECG_GET_LIST", "ECG_GOT_LIST")

    def on_ECG_GET_ITEM_DATA(self, data, meta):
        self._safe_call(self.controller.get_item_data, data, meta, "ECG_GET_ITEM_DATA", "ECG_GOT_ITEM_DATA")

    def on_ECG_GET_INFERENCE(self, data, meta):
        self._safe_call(self.controller.get_inference, data, meta, "ECG_GET_INFERENCE", "ECG_GOT_INFERENCE")
